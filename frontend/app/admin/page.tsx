'use client';
import { useDispatch, useSelector } from "@/redux/hooks";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { IHomework, toasts } from "@/misc";
import { ChangeEvent, useRef, useState } from "react";
import { editHW, addHWField, removeHWField, deletePhoto, clearEmptyContent } from "@/redux/miscSlice";
import axios from "axios";
import { TgLoginButton } from "@/components/Common";

export default function Admin() {
    const { isOpen, onOpen, onClose: onCloseRaw } = useDisclosure();
    const dispatch = useDispatch();
    const toast = useToast();
    const [activated, setActivated] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const file = useRef(new FormData());
    const { hw, isLaptop } = useSelector(state => state.misc);
    const { user } = useSelector(state => state.auth);

    function onClose() {
        setSelected(0);
        onCloseRaw();
    }

    return user && hw.length > 0
        ? <>
            <VStack spacing='20px' w={isLaptop ? '30%' : '50%'}>
                {hw.map((x: IHomework, i) => <Button w='100%' h='50px' fontSize='20px' key={i} bg='gray.600' color='white' onClick={() => {
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
                            {hw[selected].content.map((c, j) => <HStack key={j} w='100%'>
                                {/* @ts-ignore */}
                                <Textarea value={hw[selected].content[j]} minH='120px' resize='vertical' onChange={e => {
                                    if (!activated.includes(hw[selected].subject)) setActivated(s => [...s, hw[selected].subject]);
                                    dispatch(editHW({ subject: hw[selected].subject, contentNum: j, value: e.target.value }));
                                }} />

                                <Button fontSize='26px' onClick={() => {
                                    if (!activated.includes(hw[selected].subject)) setActivated(s => [...s, hw[selected].subject]);
                                    dispatch(removeHWField([hw[selected].subject, j]));
                                }}>-</Button>
                            </HStack>)}

                            <Button fontSize='26px' onClick={() => dispatch(addHWField(hw[selected].subject))}>+</Button>

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
                                                <Image src={hw[selected].image} alt='' maxH='250px' />
                                            </VStack>

                                            <Button fontSize='26px' onClick={() => {
                                                setLoading(true);
                                                axios.post(
                                                    'https://api.twodev.cc/ivbo/hw/unupload',
                                                    {
                                                        subject: hw[selected].subject.split(' ')[1]
                                                    },
                                                    { headers: { 'x-access-token': sessionStorage.getItem('hash') } }
                                                ).then(res => {
                                                    setLoading(false);
                                                    if (res.data === 200) {
                                                        dispatch(deletePhoto(selected));
                                                        toast(toasts.success('Фото удалено!'));
                                                    } else toast(toasts.error());
                                                });
                                            }}>-</Button>
                                        </HStack>}

                                        <VStack w='100%' spacing='20px'>
                                            <input type='file' onChange={(e: ChangeEvent<HTMLInputElement>) => {
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
                                                            'filename': encodeURIComponent(`${hw[selected].subject.split(' ')[1]}`),
                                                            'x-access-token': sessionStorage.getItem('hash')
                                                        }
                                                    }
                                                ).then(res => {
                                                    setLoading(false);
                                                    if (res.data === 200) toast(toasts.success('Фото сохранено!\nОбновите страницу, чтобы увидеть изменения'));
                                                    else toast(toasts.error());
                                                });
                                            }}>Сохранить</Button>
                                        </VStack>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack w='100%' justify='space-between'>
                            <Button w='48%' onClick={onClose}>Закрыть</Button>

                            <Button isDisabled={!activated.includes(hw[selected].subject)} isLoading={loading} w='48%' colorScheme='blue' mr={3} onClick={() => {
                                setLoading(true);
                                setActivated(s => s.filter(c => c !== hw[selected].subject));
                                dispatch(clearEmptyContent(selected));
                                axios.post('https://api.twodev.cc/ivbo/hw/edit', hw[selected], { headers: { 'x-access-token': sessionStorage.getItem('hash') } }).then(res => {
                                    setLoading(false);
                                    if (res.data === 200) {
                                        toast(toasts.success('Домашка сохранена!'));
                                        onClose();
                                    } else toast(toasts.error());
                                });
                            }}>
                                Сохранить
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
        : <VStack spacing='10px' color='white'>
            <Text>Войди, чтобы изменять ДЗ</Text>
            <TgLoginButton />
        </VStack>;
}
