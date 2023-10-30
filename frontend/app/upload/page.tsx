'use client';
import { Button, Divider, Heading, HStack, IconButton, Input, Link as ChakraLink, Text, Tooltip, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { iconButtonStyles, toasts } from "@/utils/misc";
import { TgLoginButton } from "@/components/Common";
import { useDispatch, useSelector } from "@/redux/hooks";
import { addFile, addTrusted, deleteFile, removeTrusted } from "@/redux/authSlice";
import { MdContentCopy } from "react-icons/md";
import { HiDownload, HiUserRemove } from "react-icons/hi";
import { BiSolidTrashAlt } from "react-icons/bi";

export default function Files() {
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [trustedField, setTrustedField] = useState('');
    const file = useRef(new FormData());
    const toast = useToast();
    const dispatch = useDispatch();
    const { user, files } = useSelector(state => state.auth);
    const { isLaptop } = useSelector(state => state.misc);

    return user
        ? <VStack spacing='20px' fontSize='20px' w={isLaptop ? '25%' : '90%'}>
            <VStack spacing='18px' color='white'>
                <Heading fontSize='22px'>Загрузить файл</Heading>

                <input type='file' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files) {
                        file.current.append('files', e.target.files[0]);
                        setUploaded(true);
                    }
                }} />

                {uploaded && <Button px='20px' isLoading={loading} onClick={() => {
                    setLoading(true);

                    axios
                        .post(
                            'https://api.twodev.cc/ivbo/upload',
                            file.current,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'x-access-token': localStorage.getItem('hash')
                                }
                            }
                        )
                        .then(res => {
                            setLoading(false);
                            if (res.data === 404) {
                                if (!toast.isActive('error-toast')) toast(toasts.error('У вас нет никнейма в Телеграм, невозможно создать папку'));
                            } else if (res.data === 500) {
                                if (!toast.isActive('error-toast')) toast(toasts.error());
                            } else {
                                if (!toast.isActive('success-toast')) toast(toasts.success('Файл загружен!'));
                                dispatch(addFile(res.data));
                                file.current = new FormData();
                                setUploaded(false);
                            }
                        });
                }}>Загрузить</Button>}

                <Text color='gray.500' fontSize='16px'>Не загружай личные файлы.</Text>
            </VStack>

            <Divider w='70vw' />

            {Object.keys(files).length > 0
                ? Object.entries(files).map(([username, files]: [string, any], i) => <VStack key={i} color='white' spacing='18px' w='100%'>
                    <Heading fontSize='30px'>{username === user.tg_username ? 'Твои файлы' : `Файлы ${username}`}</Heading>

                    <VStack spacing='10px'>
                        <Divider opacity={0.3} />

                        <Tooltip label='Нажми, чтобы скопировать' hasArrow>
                            <VStack spacing='2px' _hover={{ cursor: 'pointer' }} onClick={() => {
                                navigator.clipboard.writeText(`https://storage.twodev.cc/${username}`);
                                if (!toast.isActive('success-toast')) toast(toasts.success('Ссылка на папку скопирована!'));
                            }}>
                                <Text userSelect='none' fontSize='18px' color='blue.400' _active={{ color: 'blue.200' }}>🔗 https://storage.twodev.cc/{username}</Text>
                                {/*<Icon as={MdContentCopy} />*/}
                                <Text fontSize='14px' w='max-content' color='gray.500'>нажми на ссылку, чтобы скопировать её</Text>
                            </VStack>
                        </Tooltip>

                        <Divider opacity={0.3} />
                    </VStack>

                    <VStack spacing='5px' w='100%'>
                        {files && files.length > 0 && files.map((f: any, j: number) => <HStack w='100%' justify='space-between' key={j} color='white' spacing='20px'>
                            <Text color='blue.200'>{f}</Text>

                            <HStack spacing='10px'>
                                <Tooltip label='Скачать' hasArrow placement='top'>
                                    <ChakraLink color='blue.300' href={`https://storage.twodev.cc/${user.tg_username}/${f}`} isExternal>
                                        <IconButton aria-label='copy' icon={<HiDownload />} {...iconButtonStyles} />
                                    </ChakraLink>
                                </Tooltip>

                                <Tooltip label='Скопировать ссылку на файл' hasArrow placement='top'>
                                    <IconButton aria-label='copy' icon={<MdContentCopy />} onClick={() => {
                                        navigator.clipboard.writeText(`https://storage.twodev.cc/${user.tg_username}/${f}`);
                                        if (!toast.isActive('success-toast')) toast(toasts.success('Ссылка на файл скопирована!'));
                                    }} {...iconButtonStyles} />
                                </Tooltip>

                                <Tooltip label='Удалить файл' hasArrow placement='top'>
                                    <IconButton aria-label='delete' icon={<BiSolidTrashAlt />} onClick={() => {
                                        axios
                                            .post(
                                                'https://api.twodev.cc/ivbo/delete',
                                                { file: f },
                                                { headers: { 'x-access-token': localStorage.getItem('hash') } }
                                            )
                                            .then(res => {
                                                if (res.data === 200) {
                                                    dispatch(deleteFile(f));
                                                    if (!toast.isActive('success-toast')) toast(toasts.success('Файл удалён!'));
                                                } else {
                                                    if (!toast.isActive('error-toast')) toast(toasts.error());
                                                }
                                            });
                                    }} {...iconButtonStyles} />
                                </Tooltip>
                            </HStack>
                        </HStack>)}
                    </VStack>
                </VStack>)
                : <Text color='gray.300'>Ты ещё не загружал никакие файлы!</Text>}

            <Divider w='70vw' />

            <VStack spacing='16px' color='white'>
                <Heading fontSize='18px'>Добавить доверенное лицо</Heading>
                <Text align='center' fontSize='16px' color='gray.400'>Сможет смотреть и скачивать ваши файлы,<br />но не сможет их удалять</Text>

                <HStack w='100%'>
                    <Input placeholder='@username' value={'@' + trustedField} onChange={e => setTrustedField(e.target.value.slice(1))} />
                    <Button onClick={() => {
                        if (trustedField.length >= 5) axios
                            .post('https://api.twodev.cc/ivbo/trust', { target: trustedField }, { headers: { 'x-access-token': localStorage.getItem('hash') } })
                            .then(res => {
                                if (res.data === 500) {
                                    if (!toast.isActive('error-toast')) toast(toasts.error('Нет такого пользователя!'));
                                    return;
                                }
                                dispatch(addTrusted(trustedField));
                                setTrustedField('');
                                if (!toast.isActive('success-toast')) toast(toasts.success('Пользователь добавлен как доверенный!'));
                            });
                    }}>Добавить</Button>
                </HStack>

                <VStack>
                    {user.trusted.map((t: any, i) => <HStack key={i} color='white'>
                        <Text>{t}</Text>
                        <IconButton aria-label='remove' icon={<HiUserRemove />} {...iconButtonStyles} onClick={() => {
                            axios
                                .post('https://api.twodev.cc/ivbo/untrust', { target: t }, { headers: { 'x-access-token': localStorage.getItem('hash') } })
                                .then(res => {
                                    if (res.data === 500) {
                                        if (!toast.isActive('error-toast')) toast(toasts.error());
                                        return;
                                    }
                                    dispatch(removeTrusted(t));
                                    if (!toast.isActive('success-toast')) toast(toasts.success('Пользователь удалён из доверенных лиц!'));
                                });
                        }} />
                    </HStack>)}
                </VStack>
            </VStack>
        </VStack>
        :
        <VStack spacing='10px' color='white'>
            <Text>Войди, чтобы загрузить файлы</Text>
            <TgLoginButton />
        </VStack>
}