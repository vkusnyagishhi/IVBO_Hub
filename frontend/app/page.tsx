'use client';
import api from '@/api';
import { useEffect } from "react";
import { setData } from "@/redux/miscSlice";
import { useDispatch, useSelector } from "@/redux/hooks";
import { Text, VStack, Heading, ListItem, OrderedList } from "@chakra-ui/react";
import { IHomework } from "@/misc";
import Image from "next/image";
import { LoginButton } from "@telegram-auth/react";

export default function Home() {
    const dispatch = useDispatch();
    const { hw } = useSelector(state => state.misc);

    useEffect(() => {
        api.get('/hw').then(res => dispatch(setData(res.data)));
    }, [dispatch]);

    return <main style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '50px 0px' }}>
        <VStack w='80%' spacing='20px'>
            {hw.filter((x: IHomework) => x.content.length > 0 || x.image).map((x: IHomework, i) => <VStack key={i} color='white' spacing='10px' w='100%' p='20px' borderRadius='25px' bg='#3b3b3b'>
                <Heading size='md'>{x.subject}</Heading>
                {/*<Text>{x.updatedAt}</Text>*/}

                {x.image && <Image fill src={x.image} alt='' style={{ borderRadius: '20px' }} />}

                <OrderedList>
                    {x.content.map((c, i) => <ListItem key={i}>{c}</ListItem>)}
                </OrderedList>
            </VStack>)}

            <VStack spacing='10px' color='white' mt='20px'>
                <Text>Войдите, чтобы изменять ДЗ</Text>

                <LoginButton
                    botUsername={process.env.NODE_ENV === 'development' ? 'twodev_helper_bot' : 'ivbo1123bot'}
                    buttonSize='large'
                    cornerRadius={20}
                    showAvatar={true}
                    lang='ru'
                    onAuthCallback={(data: any) => {
                        console.log(data);
                    }}
                />
            </VStack>
        </VStack>
    </main>
}
