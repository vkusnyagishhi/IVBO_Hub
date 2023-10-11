'use client';
import { useDispatch, useSelector } from "@/redux/hooks";
import { Button, HStack, Text, Textarea, useToast, VStack } from "@chakra-ui/react";
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button';
import api from '@/api';
import { setAdminData } from "@/redux/adminSlice";
import { IHomework } from "@/misc";
import { useState } from "react";
import { editHW, addHWField, removeHWField } from "@/redux/miscSlice";
import axios from "axios";

export default function Admin() {
    const dispatch = useDispatch();
    const toast = useToast();
    const [activated, setActivated] = useState(['']);
    const { hw, isLaptop } = useSelector(state => state.misc);
    const { isRealAdmin } = useSelector(state => state.admin);

    return <VStack spacing='20px' w={isLaptop ? '70%' : '90%'}>
        {isRealAdmin && hw.map((x: IHomework, i) => <VStack w='100%' key={i} p='20px' border='2px solid gray' borderRadius='20px' color='white'>
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

            {activated.includes(x.subject) && <Button onClick={() => {
                setActivated(s => s.filter(c => c !== x.subject));
                // @ts-ignore
                axios.post('https://api.twodev.cc/ivbo/edit', { subject: x.subject, content: hw[i].content }, { headers: { 'x-access-token': sessionStorage.getItem('hash') } }).then(res => {
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
            }}>Save</Button>}
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
