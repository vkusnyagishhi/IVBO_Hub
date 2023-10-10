'use client';
import api from '@/api';
import { useEffect } from "react";
import { setData } from "@/redux/miscSlice";
import { useDispatch, useSelector } from "@/redux/hooks";
import { Text, VStack, ListItem, OrderedList, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Spinner } from "@chakra-ui/react";
import { IHomework } from "@/misc";
import Image from "next/image";
import { LoginButton } from "@telegram-auth/react";
import { motion } from 'framer-motion';

export default function Home() {
    const dispatch = useDispatch();
    const { hw, isLaptop } = useSelector(state => state.misc);

    useEffect(() => {
        api.get('/hw').then(res => dispatch(setData(res.data)));
    }, [dispatch]);

    return <main style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '50px 0px' }}>
        {hw.length > 0
            ? <Accordion w={isLaptop ? '40%' : '90%'} color='white' allowMultiple allowToggle>
                {hw.filter((x: IHomework) => x.content.length > 0 || x.image).map((x: IHomework, i) => <AccordionItem key={i}>
                    <AccordionButton fontSize='20px'>
                        <Text>{x.subject} (обновлено: {x.updatedAt}{x.updatedBy && `, кем: ${x.updatedBy}`})</Text>
                        <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel fontSize='20px'>
                        {x.image && <Image fill src={x.image} alt='' style={{ borderRadius: '20px' }} />}

                        <OrderedList>
                            {x.content.map((c, i) => <ListItem key={i}>{c}</ListItem>)}
                        </OrderedList>
                    </AccordionPanel>
                </AccordionItem>)}
            </Accordion>
            : <Spinner size='xl' color='blue.500' emptyColor='gray.400' />}

        {/*<VStack spacing='10px' color='white' mt='20px'>*/}
        {/*    <Text>Войдите, чтобы изменять ДЗ</Text>*/}

        {/*    <LoginButton*/}
        {/*        botUsername={process.env.NODE_ENV === 'development' ? 'twodev_helper_bot' : 'ivbo1123bot'}*/}
        {/*        buttonSize='large'*/}
        {/*        cornerRadius={20}*/}
        {/*        showAvatar={true}*/}
        {/*        lang='ru'*/}
        {/*        onAuthCallback={(data: any) => {*/}
        {/*            console.log(data);*/}
        {/*        }}*/}
        {/*    />*/}
        {/*</VStack>*/}
    </main>
}
