'use client';
import { useDispatch, useSelector } from "@/redux/hooks";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, HStack, Image, Input, Text, Textarea, useToast, VStack } from "@chakra-ui/react";
import { IHomework, toasts } from "@/misc";
import { ChangeEvent, useRef, useState } from "react";
import { editHW, addHWField, removeHWField, deletePhoto } from "@/redux/miscSlice";
import axios from "axios";
import { TgLoginButton } from "@/components/Common";

export default function Admin() {
    const dispatch = useDispatch();
    const toast = useToast();
    const [activated, setActivated] = useState(['']);
    const [loading, setLoading] = useState(false);
    const file = useRef(new FormData());
    const { hw, isLaptop } = useSelector(state => state.misc);
    const { user } = useSelector(state => state.auth);

    return user
        ? <VStack spacing='20px' w={isLaptop ? '70%' : '90%'}>
            {hw.map((x: IHomework, i) => <VStack w='100%' key={i} p='20px' border='2px solid gray' borderRadius='20px' color='white' spacing='14px'>
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

                <Accordion w='90%' allowToggle>
                    <AccordionItem>
                        <AccordionButton w='100%'>
                            <HStack w='100%' justify='space-between'>
                                <Text>Фото</Text>
                                <AccordionIcon />
                            </HStack>
                        </AccordionButton>

                        <AccordionPanel>
                            {x.image && <HStack w='100%' justify='center' spacing='40px'>
                                <VStack w='100%' pb='20px'>
                                    <Image src={x.image} alt='' maxH='250px' />
                                </VStack>

                                <Button fontSize='26px' onClick={() => {
                                    setLoading(true);
                                    axios.post(
                                        'https://api.twodev.cc/ivbo/hw/unupload',
                                        {
                                            subject: x.subject.split(' ')[1]
                                        },
                                        { headers: { 'x-access-token': sessionStorage.getItem('hash') } }
                                    ).then(res => {
                                        setLoading(false);
                                        if (res.data === 200) {
                                            dispatch(deletePhoto(i));
                                            toast(toasts.success('Фото удалено!'));
                                        } else toast(toasts.error());
                                    });
                                }}>-</Button>
                            </HStack>}

                            <HStack w='100%' spacing='20px'>
                                <Input type='file' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.files) {
                                        file.current.append('files', e.target.files[0]);
                                    }
                                }} />
                                <Button isLoading={loading} w='200px' onClick={() => {
                                    setLoading(true);
                                    axios.post(
                                        'https://api.twodev.cc/ivbo/hw/upload',
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
                                        if (res.data === 200) toast(toasts.success('Фото сохранено!\nОбновите страницу, чтобы увидеть изменения'));
                                        else toast(toasts.error());
                                    });
                                }}>Сохранить</Button>
                            </HStack>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>

                {activated.includes(x.subject) && <Button isLoading={loading} onClick={() => {
                    setLoading(true);
                    setActivated(s => s.filter(c => c !== x.subject));
                    // @ts-ignore
                    axios.post('https://api.twodev.cc/ivbo/hw/edit', { subject: x.subject, content: hw[i].content }, { headers: { 'x-access-token': sessionStorage.getItem('hash') } }).then(res => {
                        setLoading(false);
                        if (res.data === 200) toast(toasts.success('Домашка сохранена!'));
                        else toast(toasts.error());
                    });
                }}>Сохранить</Button>}
            </VStack>)}
        </VStack>
        : <VStack spacing='10px' color='white'>
            <Text>Войди, чтобы изменять ДЗ</Text>
            <TgLoginButton />
        </VStack>;
}
