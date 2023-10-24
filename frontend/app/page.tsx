'use client';
import { Box, Button, HStack, Icon, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, OrderedList, Spinner, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { FaBook, FaHouse } from "react-icons/fa6";
import { HWTypes, IHomework, ILesson, lessonIntervals, LessonTypes } from "@/misc";
import { useRouter } from "next/navigation";

export default function Calendar() {
    const { hw, isLaptop, table: data } = useSelector(state => state.misc);
    const [[weekIndex, weekDayIndex], setSelected] = useState([0, 7]);
    const [modalContent, setModalContent] = useState<IHomework>();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const router = useRouter();

    // useEffect(() => {
    //     const today = new Date().getDate() + 1;
    //     setSelected([Math.floor(today / 4) - 2, Math.floor(today / 7) - 3]);
    // }, []);

    return <>
        <VStack w='90%' minH='100vh' spacing='30px'>
            <VStack minH='40vh' justify='end'>
                <HStack spacing='32px' color='gray.500'>
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

                            const cellColor = weekIndex === i && weekDayIndex === j
                                ? 'linear-gradient(150deg, rgba(69,112,209,1) 0%, rgba(88,15,112,1) 100%)'
                                : now.getDate() === day && now.getMonth() === month
                                    ? 'green.600'
                                    : 'none';

                            return <VStack w='40px' h='40px' color='white' key={j} _hover={{ cursor: 'pointer' }} transition='0.2s' onClick={() => setSelected([i, j])} pos='relative'>
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
            </VStack>

            <AnimatePresence mode='wait'>
                <motion.div style={{ marginTop: '20px', minHeight: '40vh', width: isLaptop ? '50%' : '100%' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} key={weekIndex + weekDayIndex}>
                    {data[weekIndex] && data[weekIndex][weekDayIndex] && Object.keys(data[weekIndex][weekDayIndex]).length > 0
                        ? <VStack key={weekIndex + weekDayIndex} spacing='10px'>
                            {Object.keys(data[weekIndex][weekDayIndex]).map((lesson: string, i) => {
                                const theLesson: ILesson | null = data[weekIndex][weekDayIndex][lesson];
                                if (!theLesson) return <VStack key={i} color='white' w='100%' spacing='14px' p='10px' bg='blue.1000' borderRadius='20px' boxShadow='0px 4px 20px 10px rgba(34, 60, 80, 0.5)'>
                                    <HStack w='100%' justify='space-between'>
                                        <HStack w='100%' spacing='10px'>
                                            <Text w='30px' h='30px' fontWeight={600} borderRadius='full' bg='gray.500' align='center' pt='3px'>{i + 1}</Text>

                                            <VStack w='calc(100% - 30px)' align='start' spacing='2px'>
                                                <Text fontWeight={500}>—</Text>
                                                <Text opacity={0.5} fontSize='12px'>—</Text>
                                            </VStack>
                                        </HStack>
                                    </HStack>

                                    <HStack w='100%' justify='space-between' align='end'>
                                        <Text h='30px' color='gray.400' fontSize='14px' fontWeight={600} pt='5px' pl='4px'>{lessonIntervals[i]}</Text>

                                        <HStack spacing='8px' fontWeight={500}>
                                            <Text align='center' fontSize='14px' p='4px 10px' borderRadius='20px' bg='green.500'>чилл</Text>

                                            <HStack bg='red.400' p='4px 10px' borderRadius='20px'>
                                                <Icon as={FaHouse} mt='-2px' />
                                                <Text fontSize='14px'>дома</Text>
                                            </HStack>
                                        </HStack>
                                    </HStack>
                                </VStack>;

                                const { PROPERTY_DISCIPLINE_NAME, PROPERTY_LECTOR, PROPERTY_LESSON_TYPE, PROPERTY_PLACE } = theLesson;
                                const HW = hw.find((h: IHomework) =>
                                    h.subject.split(' ')[1] === HWTypes[PROPERTY_DISCIPLINE_NAME as keyof typeof HWTypes] &&
                                    (h.content.length > 0 || h.image)
                                );

                                return <VStack key={i} color='white' w='100%' spacing='14px' p='10px' bg='blue.1000' borderRadius='20px' boxShadow='0px 4px 20px 10px rgba(34, 60, 80, 0.5)'>
                                    <HStack w='100%' justify='space-between'>
                                        <HStack w='100%' spacing='10px'>
                                            <Text w='30px' h='30px' fontWeight={600} borderRadius='full' bg={PROPERTY_LESSON_TYPE === LessonTypes['пр'] ? 'blue.400' : 'purple.500'} align='center' pt='3px'>{i + 1}</Text>

                                            <VStack w='calc(100% - 30px)' align='start' spacing='2px'>
                                                <Text fontWeight={500}>{PROPERTY_DISCIPLINE_NAME}</Text>
                                                <Text opacity={0.5} fontSize='12px'>{PROPERTY_LECTOR}</Text>
                                            </VStack>
                                        </HStack>

                                        {HW && <HStack borderRadius='20px' bg='blue.700' p='3px 10px' onClick={() => {
                                            setModalContent(HW);
                                            onOpen();
                                        }} _hover={{ cursor: 'pointer' }}>
                                            <Icon as={FaBook} />
                                            <Text userSelect='none' fontWeight={500}>ДЗ</Text>
                                        </HStack>}
                                    </HStack>

                                    <HStack w='100%' justify='space-between' align='end'>
                                        <Text h='30px' color='gray.400' fontSize='14px' fontWeight={600} pt='5px' pl='4px'>{lessonIntervals[i]}</Text>

                                        <HStack spacing='8px' fontWeight={500}>
                                            <Text align='center' fontSize='14px' p='4px 10px' borderRadius='20px' bg={PROPERTY_LESSON_TYPE === LessonTypes['пр'] ? 'blue.500' : 'purple.700'}>{PROPERTY_LESSON_TYPE === 'П' ? 'пр' : 'лек'}</Text>

                                            <HStack bg='red.400' p='4px 10px' borderRadius='20px'>
                                                <Icon as={FaHouse} mt='-2px' />
                                                <Text fontSize='14px'>{PROPERTY_PLACE}</Text>
                                            </HStack>
                                        </HStack>
                                    </HStack>
                                </VStack>;
                            })}
                        </VStack>
                        : (weekDayIndex < 7 && <Text align='center' color='white'>{weekDayIndex === 6 ? 'нахер ты на воскресенье нажал' : 'Пар нет!'}</Text>)}
                </motion.div>
            </AnimatePresence>
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent w='90vw'>
                <ModalHeader color='white'>{modalContent?.subject}</ModalHeader>
                <ModalCloseButton color='white' />
                <ModalBody bg='blue.900' py='20px'>
                    <OrderedList color='white'>
                        {modalContent?.content && modalContent.content.map((c: string, i: number) => <ListItem key={i}>{c}</ListItem>)}
                    </OrderedList>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' onClick={() => router.push('/admin')}>Изменить</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
}