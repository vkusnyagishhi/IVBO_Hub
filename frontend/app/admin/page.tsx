'use client';
import { useDispatch, useSelector } from "@/redux/hooks";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Button, HStack, Image, Input, Text, Textarea, useToast, VStack } from "@chakra-ui/react";
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button';
import api from '@/api';
import { setAdminData } from "@/redux/adminSlice";
import { IHomework } from "@/misc";
import { ChangeEvent, useRef, useState } from "react";
import { editHW, addHWField, removeHWField, deletePhoto } from "@/redux/miscSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Admin() {
    const dispatch = useDispatch();
    const toast = useToast();
    const router = useRouter();
    const [activated, setActivated] = useState(['']);
    const [loading, setLoading] = useState(false);
    const file = useRef(new FormData());
    const { hw, isLaptop } = useSelector(state => state.misc);
    const { isRealAdmin } = useSelector(state => state.admin);

    return <VStack spacing='20px' w={isLaptop ? '70%' : '90%'}>
        {isRealAdmin && hw.map((x: IHomework, i) => <VStack w='100%' key={i} p='20px' border='2px solid gray' borderRadius='20px' color='white' spacing='14px'>
            <Text fontSize='20px'>{x.subject}</Text>

            {x.content.map((c, j) => <HStack key={j} w='100%'>
                {/* @ts-ignore */}
                <Textarea value={hw[i].content[j]} minH='120px' resize='vertical' onChange={e => {
                    if (!activated.includes(x.subject)) setActivated(s => [...s, x.subject]);
                    dispatch(editHW({ subject: x.subject, contentNum: j, value: e.target.value }));
                }} />

                <Button fontSize='26px' onClick={() => {
                    if (!activated.includes(x.subject)) setActivated(s => [...s, x.subject]);
                    dispatch(removeHWField([x.subject, j]));
                }}>-</Button>
            </HStack>)}

            <Button fontSize='26px' onClick={() => dispatch(addHWField(x.subject))}>+</Button>

            <Accordion w='90%'>
                <AccordionItem>
                    <AccordionButton>
                        <Text>Фото</Text>
                    </AccordionButton>
                    <AccordionPanel>
                        {x.image && <HStack w='100%' justify='center' spacing='40px'>
                            <VStack w='100%' pb='20px'>
                                <Image src={x.image} alt='' maxH='250px' />
                            </VStack>

                            <Button fontSize='26px' onClick={() => {
                                setLoading(true);
                                axios.post(
                                    'https://api.twodev.cc/ivbo/unupload',
                                    {
                                        subject: x.subject.split(' ')[1]
                                    },
                                    { headers: { 'x-access-token': sessionStorage.getItem('hash') } }
                                ).then(res => {
                                    setLoading(false);
                                    if (res.data === 200) {
                                        dispatch(deletePhoto(i));
                                        toast({
                                            status: 'success',
                                            title: 'Успешно',
                                            description: 'Фото удалено!',
                                            duration: 5000
                                        });
                                    } else toast({
                                        status: 'error',
                                        title: 'Ошибка',
                                        description: 'Обратитесь к админу',
                                        duration: 5000
                                    });
                                });
                            }}>-</Button>
                        </HStack>}

                        {!loading && <HStack w='100%' spacing='20px'>
                            <Text>Загрузить фото:</Text>
                            <Input type='file' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files) {
                                    file.current.append('files', e.target.files[0]);
                                }
                            }} />
                            <Button w='200px' onClick={() => {
                                setLoading(true);
                                axios.post(
                                    'https://api.twodev.cc/ivbo/upload',
                                    file.current,
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                            'filename': encodeURIComponent(`${x.subject.split(' ')[1]}`),
                                            'x-access-token': sessionStorage.getItem('hash')
                                        }
                                    }
                                ).then(res => {
                                    setLoading(false);
                                    if (res.data === 200) {
                                        toast({
                                            status: 'success',
                                            title: 'Успешно',
                                            description: 'Фото сохранено!\nОбновите страницу, чтобы увидеть изменения',
                                            duration: 5000
                                        });
                                    }else toast({
                                        status: 'error',
                                        title: 'Ошибка',
                                        description: 'Обратитесь к админу',
                                        duration: 5000
                                    });
                                });
                            }}>Сохранить</Button>
                        </HStack>}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            {activated.includes(x.subject) && !loading && <Button onClick={() => {
                setLoading(true);
                setActivated(s => s.filter(c => c !== x.subject));
                // @ts-ignore
                axios.post('https://api.twodev.cc/ivbo/edit', { subject: x.subject, content: hw[i].content }, { headers: { 'x-access-token': sessionStorage.getItem('hash') } }).then(res => {
                    setLoading(false);
                    if (res.data === 200) toast({
                        status: 'success',
                        title: 'Успешно',
                        description: 'Домашка сохранена!',
                        duration: 5000
                    });
                    else toast({
                        status: 'error',
                        title: 'Ошибка',
                        description: 'Обратитесь к админу',
                        duration: 5000
                    });
                });
            }}>Сохранить</Button>}
        </VStack>)}

        {!isRealAdmin && <VStack spacing='10px' color='white'>
            <Text>Войдите, чтобы изменять ДЗ</Text>

            <TelegramLoginButton
                botName={process.env.NODE_ENV === 'development' ? 'twodev_helper_bot' : 'ivbo1123bot'}
                cornerRadius={20}
                usePic={true}
                dataOnauth={(data: any) => {
                    api.post('/login', data).then(res => {
                        if (res.data === 500) toast({
                            status: 'error',
                            title: 'Ошибка',
                            description: 'Вы не админ!',
                            duration: 4000
                        });
                        else {
                            dispatch(setAdminData(res.data));
                            sessionStorage.setItem('hash', data.hash);
                        }
                    });
                }}
            />
        </VStack>}
    </VStack>
}
