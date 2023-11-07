'use client';
import { useDispatch, useSelector } from "@/redux/hooks";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, HStack, Icon, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { HWTypes, IHomework, toasts } from "@/utils/misc";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { deletePhoto, editHW, setData } from "@/redux/miscSlice";
import axios from "axios";
import { TgLoginButton } from "@/components/Common";
import { AiFillBulb } from "react-icons/ai";
import { useRouter } from "next/navigation";

export default function Admin() {
    const { isOpen, onOpen: onOpenRaw, onClose: onCloseRaw } = useDisclosure();
    const dispatch = useDispatch();
    const toast = useToast();
    const router = useRouter();
    const [activated, setActivated] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [uploaded, setUploaded] = useState(false);
    const file = useRef(new FormData());
    const { hw, isLaptop, editingHWs } = useSelector(state => state.misc);
    const { user } = useSelector(state => state.auth);
    const [openQuery, setOpenQuery] = useState(false);

    const onOpen = useCallback(() => {
        // dispatch({ type: 'socket/send', payload: { action: 'opened', subject: hw[selected].subject } });
        onOpenRaw();
    }, [onOpenRaw]);

    function onClose() {
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setData(res.data)));
        if (openQuery) router.push('/');
        else setSelected(0);
        // dispatch({ type: 'socket/send', payload: { action: 'closed', subject: hw[selected].subject } });
        onCloseRaw();
    }

    useEffect(() => {
        const open = new URL(window.location.href).searchParams.get('open');
        if (open && !editingHWs.includes(HWTypes[open as keyof typeof HWTypes])) {
            setOpenQuery(true);
            setSelected(hw.findIndex((h: IHomework) => h.subject.includes(HWTypes[open as keyof typeof HWTypes])));
            onOpen();
        }
    }, [editingHWs, hw, onOpen]);

    return user
        ? <>
            <VStack spacing='20px' w={isLaptop ? '30%' : '50%'}>
                {hw.map((x: IHomework, i) => <Button opacity={editingHWs.includes(x.subject) ? 0.5 : 1} w='100%' h='50px' fontSize='20px' key={i} bg='gray.600' _hover={{ bg: 'gray.500' }} _active={{ bg: 'gray.400' }} color='white' onClick={() => {
                    if (editingHWs.includes(x.subject)) return;
                    setSelected(i);
                    onOpen();
                }}>{x.subject}</Button>)}
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} size='full'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color='white'>Изменить: {hw[selected].subject}</ModalHeader>
                    <ModalCloseButton color='white' />

                    <ModalBody bg='black' h='100%'>
                        <VStack w='100%' h='100%' color='white' spacing='14px'>
                            {/*{hw[selected].content.map((c, j) => <HStack key={j} w='100%'>*/}
                            {/*    /!* @ts-ignore *!/*/}
                            {/*    <Textarea value={hw[selected].content[j]} minH='120px' resize='vertical' onChange={e => {*/}
                            {/*        if (!activated.includes(hw[selected].subject)) setActivated(s => [...s, hw[selected].subject]);*/}
                            {/*        dispatch(editHW({ subject: hw[selected].subject, contentNum: j, value: e.target.value }));*/}
                            {/*    }} />*/}

                            {/*    <Button fontSize='26px' onClick={() => {*/}
                            {/*        if (!activated.includes(hw[selected].subject)) setActivated(s => [...s, hw[selected].subject]);*/}
                            {/*        dispatch(removeHWField([hw[selected].subject, j]));*/}
                            {/*    }}>-</Button>*/}
                            {/*</HStack>)}*/}

                            <Textarea value={hw[selected].content} minH='200px' resize='vertical' onChange={e => {
                                if (!activated.includes(hw[selected].subject)) setActivated(s => [...s, hw[selected].subject]);
                                dispatch(editHW({ subject: hw[selected].subject, value: e.target.value }));
                            }} />

                            <Button w='50%' bg='red.500' color='white' onClick={() => {
                                if (!activated.includes(hw[selected].subject)) setActivated(s => [...s, hw[selected].subject]);
                                dispatch(editHW({ subject: hw[selected].subject, value: '' }));
                            }} _hover={{ cursor: 'pointer', bg: 'red.400' }} _active={{ bg: 'red.300' }}>Очистить поле</Button>

                            {/*{(hw[selected].content.length === 0 || hw[selected].content.filter((x: string) => x.length < 1).length === 0) && <Button fontSize='26px' onClick={() => dispatch(addHWField(hw[selected].subject))}>+</Button>}*/}

                            <Accordion w='90%' allowToggle>
                                <AccordionItem>
                                    <AccordionButton w='100%'>
                                        <HStack w='100%' justify='space-between'>
                                            <Text>Фото</Text>
                                            <AccordionIcon />
                                        </HStack>
                                    </AccordionButton>

                                    <AccordionPanel>
                                        {hw[selected].image && <HStack w='100%' justify='center' spacing='40px'>
                                            <VStack w='100%' pb='20px'>
                                                <Image src={hw[selected].image ?? undefined} alt='' maxH='250px' />
                                            </VStack>

                                            <Button fontSize='26px' onClick={() => {
                                                setLoading(true);
                                                axios.post(
                                                    'https://api.twodev.cc/ivbo/hw/unupload',
                                                    { subject: hw[selected].subject.split(' ')[1] },
                                                    { headers: { 'x-access-token': localStorage.getItem('hash') } }
                                                ).then(res => {
                                                    setLoading(false);
                                                    if (res.data === 200) {
                                                        dispatch(deletePhoto(selected));
                                                        if (!toast.isActive('success-toast')) toast(toasts.success('Фото удалено!'));
                                                    } else {
                                                        if (!toast.isActive('error-toast')) toast(toasts.error());
                                                    }
                                                });
                                            }}>-</Button>
                                        </HStack>}

                                        <VStack w='100%' spacing='20px'>
                                            <input type='file' onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.files) {
                                                    setUploaded(true);
                                                    file.current.append('files', e.target.files[0]);
                                                }
                                            }} />
                                            {uploaded && <Button isLoading={loading} w='200px' onClick={() => {
                                                setLoading(true);
                                                axios
                                                    .post(
                                                        'https://api.twodev.cc/ivbo/hw/upload',
                                                        file.current,
                                                        {
                                                            headers: {
                                                                'Content-Type': 'multipart/form-data',
                                                                'filename': encodeURIComponent(`${hw[selected].subject.split(' ')[1]}`),
                                                                'x-access-token': localStorage.getItem('hash')
                                                            }
                                                        }
                                                    )
                                                    .then(res => {
                                                        setLoading(false);
                                                        setUploaded(false);
                                                        if (res.data === 200) {
                                                            if (!toast.isActive('success-toast')) toast(toasts.success('Фото сохранено!\nОбновите страницу, чтобы увидеть изменения'));
                                                            axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setData(res.data)));
                                                        } else {
                                                            if (!toast.isActive('error-toast')) toast(toasts.error());
                                                        }
                                                    });
                                            }}>Сохранить</Button>}
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <VStack w='100%' spacing='14px'>
                            <HStack w='90%' color='white' opacity={0.3}>
                                <Icon as={AiFillBulb} boxSize='20px' />
                                <Text fontSize='14px'><b>Подсказка:</b> попробуй потянуть область ввода текста за нижний правый угол</Text>
                            </HStack>

                            <HStack w='100%' justify='space-between'>
                                <Button w='48%' onClick={onClose}>Закрыть</Button>

                                <Button isDisabled={!activated.includes(hw[selected].subject)} isLoading={loading} w='48%' colorScheme='blue' mr={3} onClick={() => {
                                    setLoading(true);
                                    setActivated(s => s.filter(c => c !== hw[selected].subject));

                                    axios.post('https://api.twodev.cc/ivbo/hw/edit', hw[selected], { headers: { 'x-access-token': localStorage.getItem('hash') } }).then(res => {
                                        setLoading(false);
                                        if (res.data === 200) {
                                            if (!toast.isActive('success-toast')) toast(toasts.success('Домашка сохранена!'));
                                            onClose();
                                        } else {
                                            if (!toast.isActive('error-toast')) toast(toasts.error());
                                        }
                                    });
                                }}>
                                    Сохранить
                                </Button>
                            </HStack>
                        </VStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
        : <VStack spacing='10px' color='white'>
            <Text>Войди, чтобы изменять ДЗ</Text>
            <TgLoginButton />
        </VStack>;
}
