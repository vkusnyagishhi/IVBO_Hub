'use client';
import { HStack, Text, VStack, Spinner, Icon, Box, IconButton, useDisclosure, Modal, ModalBody, ModalCloseButton, ModalHeader, ModalContent, ModalOverlay, OrderedList, ListItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "@/redux/hooks";
import { setTable } from "@/redux/miscSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FaBook, FaHouse } from "react-icons/fa6";
import { HWTypes, IHomework, ILesson, LessonTypes } from "@/misc";

export default function Calendar() {
    const dispatch = useDispatch();
    const { table: data, hw } = useSelector(state => state.misc);
    const [[weekIndex, weekDayIndex], setSelected] = useState([0, 6]);
    const [modalContent, setModalContent] = useState<IHomework>();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setTable(res.data)));
    }, [dispatch]);

    return <>
        <VStack w='85%'>
            <HStack w='95%' justify='space-between' color='gray.500'>
                {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => <Text key={d}>{d}</Text>)}
            </HStack>

            {data.length > 0
                ? data.map((week: object[], i) => <HStack key={i} color='white' spacing='10px'>
                    {week.map((dayTable: any, j) => {
                        const isEmpty = dayTable.every((l: any) => !l);
                        const now = new Date();
                        let day = 7 * i + j + 2;
                        let month = 9;

                        if (day > 31) {
                            day -= 31;
                            month = 10;
                        }

                        const cellColor = isEmpty
                            ? 'rgba(255,255,255,.3)'
                            : weekIndex === i && weekDayIndex === j
                                ? 'purple.300'
                                : now.getDate() === day && now.getMonth() === month
                                    ? 'purple.500'
                                    : 'none';

                        return <VStack w='40px' h='40px' color='white' key={j} _hover={{ cursor: 'pointer' }} transition='0.2s' onClick={() => {
                            if (!isEmpty) setSelected([i, j]);
                        }} pos='relative'>
                            {day > 0 && <Text userSelect='none' pt='8px' zIndex={1}>{day}</Text>}

                            <Box w='75%' h='75%' borderRadius='200px' bg={cellColor} pos='absolute' top='5.5px' left='5px' />

                            <HStack pos='absolute' bottom='-5px' spacing='2px'>
                                {data[i][j].filter((x: ILesson | null) => x?.PROPERTY_LESSON_TYPE).map((x: any, i: number) =>
                                    <Box key={i} w='6px' h='6px' bg={x.PROPERTY_LESSON_TYPE === 'П' ? 'blue.400' : 'purple.500'} borderRadius='200px' />)}
                            </HStack>
                        </VStack>;
                    })}
                </HStack>)
                : <Spinner size='xl' color='blue.500' emptyColor='gray.400' />}

            <AnimatePresence mode='wait'>
                <motion.div style={{ width: '100%', minHeight: '40vh', marginTop: '20px' }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.15 }} key={weekIndex + weekDayIndex}>
                    {data[weekIndex] && data[weekIndex][weekDayIndex] && Object.keys(data[weekIndex][weekDayIndex]).length > 0
                        && <VStack key={weekIndex + weekDayIndex}>
                            {Object.keys(data[weekIndex][weekDayIndex]).map((lesson: string, i) => {
                                const theLesson: ILesson | null = data[weekIndex][weekDayIndex][lesson];
                                if (!theLesson) return <></>; // <Text color='white'>{i + 1}. [ОКНО]</Text>;

                                const { PROPERTY_DISCIPLINE_NAME, PROPERTY_LESSON_TYPE, PROPERTY_PLACE, PROPERTY_LECTOR } = theLesson;
                                const HW = hw.find((h: IHomework) =>
                                    h.subject.split(' ')[1] === HWTypes[PROPERTY_DISCIPLINE_NAME as keyof typeof HWTypes] &&
                                    (h.content.length > 0 || h.image)
                                );

                                return <VStack key={i} color='white' w='100%' spacing='14px' p='10px' border='2px dotted blue' borderRadius='20px'>
                                    <HStack w='100%' justify='space-between'>
                                        <HStack w='100%' spacing='10px'>
                                            <Text w='30px' h='30px' borderRadius='full' bg={PROPERTY_LESSON_TYPE === LessonTypes['пр'] ? 'blue.400' : 'purple.500'} align='center' pt='3px'>{i + 1}</Text>
                                            <Text w='80%'>{PROPERTY_DISCIPLINE_NAME}</Text>
                                        </HStack>

                                        {HW && <HStack borderRadius='20px' bg='blue.700' p='3px 10px' onClick={() => {
                                            setModalContent(HW);
                                            onOpen();
                                        }}>
                                            <Icon as={FaBook} />
                                            <Text>ДЗ</Text>
                                        </HStack>}
                                    </HStack>

                                    <HStack w='100%' justify='space-between' align='end'>
                                        <Text opacity={0.5} fontSize='12px'>{PROPERTY_LECTOR}</Text>

                                        <HStack spacing='8px'>
                                            <Text w='40px' align='center' fontSize='14px' p='4px' borderRadius='20px' bg={PROPERTY_LESSON_TYPE === LessonTypes['пр'] ? 'blue.500' : 'purple.700'}>{PROPERTY_LESSON_TYPE === 'П' ? 'пр' : 'лек'}</Text>

                                            <HStack bg='red.400' p='4px 10px' borderRadius='20px'>
                                                <Icon as={FaHouse} mt='-2px' />
                                                <Text fontSize='14px'>{PROPERTY_PLACE}</Text>
                                            </HStack>
                                        </HStack>
                                    </HStack>
                                </VStack>;
                            })}
                        </VStack>}
                </motion.div>
            </AnimatePresence>
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent w='90vw'>
                <ModalHeader color='white'>{modalContent?.subject}</ModalHeader>
                <ModalCloseButton color='white' />
                <ModalBody bg='blue.900'>
                    <OrderedList color='white'>
                        {modalContent?.content && modalContent.content.map((c: string, i: number) => <ListItem key={i}>{c}</ListItem>)}
                    </OrderedList>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>
}