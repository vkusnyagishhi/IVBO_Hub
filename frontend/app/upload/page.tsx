'use client';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, Divider, Heading, HStack, Icon, IconButton, Input, Link as ChakraLink, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import { ChangeEvent, useRef, useState } from "react";
import { iconButtonStyles, toasts } from "@/utils/misc";
import { TgLoginButton } from "@/components/Common";
import { useDispatch, useSelector } from "@/redux/hooks";
import { addFile, addTrusted, deleteFile, removeTrusted } from "@/redux/authSlice";
import { MdContentCopy } from "react-icons/md";
import { HiDownload, HiUserRemove } from "react-icons/hi";
import { BiSolidTrashAlt } from "react-icons/bi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";

export default function Files() {
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [trustedField, setTrustedField] = useState('');
    const [fileToDelete, setFileToDelete] = useState('');
    const file = useRef(new FormData());
    const toast = useToast();
    const dispatch = useDispatch();
    const { user, files } = useSelector(state => state.auth);
    const { isLaptop } = useSelector(state => state.misc);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return user
        ? <>
            <VStack spacing='40px' fontSize='20px' w={isLaptop ? '25%' : '90%'}>
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
                                    <Text fontSize='14px' w='max-content' color='gray.500'>нажми на ссылку, чтобы скопировать её</Text>
                                </VStack>
                            </Tooltip>

                            <Divider opacity={0.3} />
                        </VStack>

                        <VStack spacing='6px' w='100%'>
                            {files && files.length > 0 && files.map((f: any, j: number) => <HStack w='100%' justify='space-between' key={j} color='white' spacing='20px'>
                                <ChakraLink color='blue.300' href={`https://storage.twodev.cc/${user.tg_username}/${f}`} isExternal>
                                    <Text color='blue.200' fontSize='17px' wordBreak='break-all'>{f}</Text>
                                </ChakraLink>

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

                                    <IconButton aria-label='delete' onClick={() => {
                                        setFileToDelete(f);
                                        onOpen();
                                    }} icon={<BiSolidTrashAlt />} {...iconButtonStyles} />
                                </HStack>
                            </HStack>)}
                        </VStack>
                    </VStack>)
                    : <Text color='gray.300'>Ты ещё не загружал никакие файлы!</Text>}

                <Accordion w='100%' allowToggle>
                    <AccordionItem>
                        <AccordionButton color='white'>
                            <HStack w='100%' justify='space-between'>
                                <Icon boxSize='30px' as={AiOutlineCloudUpload} />
                                <Text>Загрузить файл</Text>
                                <AccordionIcon />
                            </HStack>
                        </AccordionButton>

                        <AccordionPanel>
                            <VStack spacing='10px' color='white'>
                                <Input w='100%' border='2px dashed rgba(255,255,255,0.5)' h='max-content' borderRadius='200px' py='14px' type='file' onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
                                                    'x-access-token': localStorage.getItem('ivbo_token')
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
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionButton color='white'>
                            <HStack w='100%' justify='space-between'>
                                <Icon boxSize='30px' as={BsPeople} />
                                <Text>Доверенные лица</Text>
                                <AccordionIcon />
                            </HStack>
                        </AccordionButton>

                        <AccordionPanel>
                            <VStack spacing='16px' color='white'>
                                <Text w='90vw' align='center' fontSize='16px' color='gray.400'>Доверенные лица могут смотреть и скачивать твои файлы, но <b>не</b> могут их удалять</Text>

                                <HStack w='100%'>
                                    <Input placeholder='@username' value={'@' + trustedField} onChange={e => setTrustedField(e.target.value.slice(1))} />
                                    <Button onClick={() => {
                                        if (trustedField.length >= 5) axios
                                            .post('https://api.twodev.cc/ivbo/trust', { target: trustedField }, { headers: { 'x-access-token': localStorage.getItem('ivbo_token') } })
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
                                                .post('https://api.twodev.cc/ivbo/untrust', { target: t }, { headers: { 'x-access-token': localStorage.getItem('ivbo_token') } })
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
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size='sm'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color='white'>Удаление файла</ModalHeader>
                    <ModalCloseButton color='white' />
                    <ModalBody bg='blue.900' color='white'>
                        <Text align='center' fontSize='20px'>Подтвердите удаление<br /><b>{fileToDelete}</b></Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>Отменить</Button>
                        <Button colorScheme='red' onClick={() => {
                            axios
                                .post(
                                    'https://api.twodev.cc/ivbo/delete',
                                    { file: fileToDelete },
                                    { headers: { 'x-access-token': localStorage.getItem('ivbo_token') } }
                                )
                                .then(res => {
                                    onClose();
                                    if (res.data === 200) {
                                        dispatch(deleteFile(fileToDelete));
                                        if (!toast.isActive('success-toast')) toast(toasts.success('Файл удалён!'));
                                    } else {
                                        if (!toast.isActive('error-toast')) toast(toasts.error());
                                    }
                                });
                        }}>Удалить</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
        : <VStack spacing='10px' color='white'>
            <Text>Войди, чтобы загрузить файлы</Text>
            <TgLoginButton />
        </VStack>
}