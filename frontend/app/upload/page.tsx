'use client';
import { Button, Input, Text, useToast, VStack, Link as ChakraLink, Heading, HStack, IconButton, Tooltip, Divider } from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { toasts } from "@/misc";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { TgLoginButton } from "@/components/Common";
import { useDispatch, useSelector } from "@/redux/hooks";
import { addFile } from "@/redux/authSlice";
import { MdContentCopy } from "react-icons/md";

export default function Files() {
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const file = useRef(new FormData());
    const toast = useToast();
    const dispatch = useDispatch();
    const { user, files } = useSelector(state => state.auth);

    return user
        ? <VStack spacing='20px' fontSize='20px'>
            <VStack spacing='10px' color='white'>
                <Text>Загрузить файл</Text>
                <Input type='file' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                        file.current.append('files', e.target.files[0]);
                        setUploaded(true);
                    }
                }} />

                {uploaded && <Button w='200px' isLoading={loading} onClick={() => {
                    setLoading(true);

                    axios
                        .post(
                            'https://api.twodev.cc/ivbo/upload',
                            file.current,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'x-access-token': sessionStorage.getItem('hash')
                                }
                            }
                        )
                        .then(res => {
                            setLoading(false);
                            if (res.data === 404) toast(toasts.error('У вас нет никнейма в Телеграм, невозможно создать папку'));
                            else if (res.data === 500) toast(toasts.error());
                            else {
                                toast(toasts.success('Файл загружен!'));
                                dispatch(addFile(res.data));
                                file.current = new FormData();
                                setUploaded(false);
                            }
                        });
                }}>Загрузить</Button>}
            </VStack>

            {/* res.length > 0 && <VStack>
                <Text>✅ Файл загружен и доступен по ссылке:</Text>
                <ChakraLink color='blue.300' href={res} isExternal>{res} <ExternalLinkIcon mx='2px' /></ChakraLink>
            </VStack> */}

            <Divider w='70vw' />

            {files.length > 0
                ? <VStack color='white' spacing='10px'>
                    <Heading fontSize='30px'>Твои файлы</Heading>
                    {/* @ts-ignore */}
                    <VStack spacing='5px' w='100%'>
                        {files.map((f, i) => <HStack w='100%' justify='space-between' key={i} color='white' spacing='20px'>
                            <ChakraLink color='blue.300' href={`https://storage.twodev.cc/${user.tg_username}/${f}`} isExternal>{f} <ExternalLinkIcon mx='2px' /></ChakraLink>

                            <Tooltip label='Скопировать ссылку на файл' hasArrow>
                                <IconButton aria-label='copy' icon={<MdContentCopy />} onClick={() => {
                                    navigator.clipboard.writeText(`https://storage.twodev.cc/${user.tg_username}/${f}`);
                                    toast(toasts.success('Скопировано!'));
                                }} boxSize='50px' fontSize='20px' color='white' bg='gray.700' transition='0.3s' _hover={{ color: 'gray.300', cursor: 'pointer' }} _active={{ color: 'gray.500' }} />
                            </Tooltip>
                        </HStack>)}
                    </VStack>
                </VStack>
                : <Text>Ты ещё не загружал никакие файлы!</Text>}

            <Text color='gray.500'>Не загружай сюда личные файлы.</Text>
        </VStack>
        : <VStack spacing='10px' color='white'>
            <Text>Войди, чтобы загрузить файлы</Text>

            <TgLoginButton />
        </VStack>;
}