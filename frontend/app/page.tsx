'use client';
import { Box, Button, HStack, Icon, Image, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, OrderedList, Spinner, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { FaBook, FaHouse } from "react-icons/fa6";
import { HWTypes, IHomework, ILesson, lessonIntervals, LessonTypes, months } from "@/utils/misc";
import { useRouter } from "next/navigation";
import { setSelected, swipe } from "@/redux/miscSlice";
import { BiEdit } from "react-icons/bi";

const subjectCardStyles = {
    color: 'white',
    w: '100%',
    spacing: '14px',
    p: '10px',
    bg: 'whiteAlpha.200',
    borderRadius: '20px',
    boxShadow: '0px 0px 14px 0px rgba(255, 255, 255, 0.2)'
};

export default function Calendar() {
    const { hw, isLaptop, table: data, calendarSelected: [weekIndex, weekDayIndex] } = useSelector(state => state.misc);
    const [modalContent, setModalContent] = useState<IHomework>();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const router = useRouter();
    const dispatch = useDispatch();

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [rightDir, setRightDir] = useState(true);

    const minSwipeDistance = 40;
    const onTouchStart = (e: any) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    }
    const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe || isRightSwipe) {
            setRightDir(isLeftSwipe);
            dispatch(swipe(isLeftSwipe ? 1 : -1));
        }
    }

    return <>
        <VStack w='100%' minH='100vh' spacing='24px'>
            <VStack w='100%' pt='10px' pb='24px'>
                <Text w='88%' color='white' opacity={0.7}>{months[new Date().getMonth()]}</Text>

                <HStack spacing='32px' color='gray.500'>
                    {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => <Text key={d}>{d}</Text>)}
                </HStack>

                {data.length > 0
                    ? data.map((week: object[], i) => <HStack key={i} color='white' spacing='10px'>
                        {week.map((dayTable: any, j) => {
                            const now = new Date();
                            let day = 7 * i + j + 30;
                            let month = 9;

                            if (day > 31) {
                                day -= 31;
                                month = 10;
                            }

                            const isSelected = weekIndex === i && weekDayIndex === j;

                            return <VStack w='40px' h='40px' color='white' key={j} _hover={{ cursor: 'pointer' }} onClick={() => {
                                setRightDir(true);
                                dispatch(setSelected([i, j]));
                            }} pos='relative'>
                                {day > 0 && <Text userSelect='none' pt='8px' zIndex={2}>{day}</Text>}

                                <Box zIndex={1} w='75%' h='75%' borderRadius='200px' bg={isSelected ? 'linear-gradient(150deg, rgba(69,112,209,1) 0%, rgba(88,15,112,1) 100%)' : 'none'} opacity={isSelected ? 1 : 0} pos='absolute' transition='0.15s' top='5.5px' left='5px' />
                                {now.getDate() === day && now.getMonth() === month && <Box w='75%' h='75%' borderRadius='200px' bg='green.600' pos='absolute' top='5.5px' left='5px' />}

                                <HStack pos='absolute' bottom='-5px' spacing='2px'>
                                    {data[i][j].filter((x: ILesson | null) => x?.PROPERTY_LESSON_TYPE).map((x: any, i: number) =>
                                        <Box key={i} w='6px' h='6px' bg={x.PROPERTY_LESSON_TYPE === 'П' ? 'blue.400' : (x.PROPERTY_LESSON_TYPE === 'ЛБ' ? 'red.300' : 'purple.500')} borderRadius='200px' />)}
                                </HStack>
                            </VStack>;
                        })}
                    </HStack>)
                    : <Spinner size='xl' speed='0.4s' thickness='3px' mt='30px' color='white' />}
            </VStack>

            <AnimatePresence mode='wait'>
                <motion.div style={{ minHeight: '40vh', width: isLaptop ? '40%' : '90%', position: 'relative' }} initial={{ opacity: 0, x: rightDir ? 10 : -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: rightDir ? -10 : 10 }} transition={{ duration: 0.15 }} key={weekIndex + weekDayIndex} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                    {data[weekIndex] && data[weekIndex][weekDayIndex] && Object.keys(data[weekIndex][weekDayIndex]).length > 0
                        ? <VStack key={weekIndex + weekDayIndex} spacing='18px'>
                            {Object.keys(data[weekIndex][weekDayIndex]).map((lesson: string, i) => {
                                const theLesson: ILesson | null = data[weekIndex][weekDayIndex][lesson];
                                if (!theLesson) return <VStack key={i} {...subjectCardStyles}>
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
                                                <Text fontSize='14px'>{i > 0 ? 'не дома :(' : 'дома :)'}</Text>
                                            </HStack>
                                        </HStack>
                                    </HStack>
                                </VStack>;

                                const { PROPERTY_DISCIPLINE_NAME, PROPERTY_LECTOR, PROPERTY_LESSON_TYPE, PROPERTY_PLACE } = theLesson;
                                const HW = hw.find((h: IHomework) =>
                                    h.subject.split(' ')[1] === HWTypes[PROPERTY_DISCIPLINE_NAME as keyof typeof HWTypes] &&
                                    (h.content.length > 0 || h.image)
                                );

                                return <VStack key={i} {...subjectCardStyles}>
                                    <HStack w='100%' justify='space-between' align='start'>
                                        <HStack w='100%' spacing='10px'>
                                            <Text w='30px' h='30px' fontWeight={600} borderRadius='full' bg={PROPERTY_LESSON_TYPE === LessonTypes['пр'] ? 'blue.400' : (PROPERTY_LESSON_TYPE === LessonTypes['лаб'] ? 'red.300' : 'purple.500')} align='center' pt='3px'>{i + 1}</Text>

                                            <VStack w='calc(100% - 30px)' align='start' spacing='2px'>
                                                <Text fontWeight={500}>{PROPERTY_DISCIPLINE_NAME}</Text>
                                                <Text opacity={0.5} fontSize='12px'>{PROPERTY_LECTOR}</Text>
                                            </VStack>
                                        </HStack>

                                        {Object.keys(HWTypes).includes(PROPERTY_DISCIPLINE_NAME) && PROPERTY_LESSON_TYPE === LessonTypes['пр'] && <HStack borderRadius='20px' bg={HW ? 'blue.500' : 'blue.600'} p='4px 18px' spacing='5px' boxShadow='0px 0px 10px 0px rgba(255, 255, 255, 0.35)' onClick={() => {
                                            if (HW) {
                                                setModalContent(HW);
                                                onOpen();
                                            } else router.push('/edit?open=' + PROPERTY_DISCIPLINE_NAME);
                                        }} _hover={{ cursor: 'pointer' }}>
                                            <Icon as={HW ? FaBook : BiEdit} boxSize='20px' pt='2px' />
                                            <Text userSelect='none' fontWeight={500}>ДЗ</Text>
                                        </HStack>}
                                    </HStack>

                                    <HStack w='100%' justify='space-between' align='end'>
                                        <Text h='30px' color='gray.400' fontSize='14px' fontWeight={600} pt='5px' pl='4px'>{lessonIntervals[i]}</Text>

                                        <HStack spacing='8px' fontWeight={500}>
                                            <Text align='center' fontSize='14px' p='4px 10px' borderRadius='20px' bg={PROPERTY_LESSON_TYPE === LessonTypes['пр'] ? 'blue.500' : (PROPERTY_LESSON_TYPE === LessonTypes['лаб'] ? 'red.300' : 'purple.700')}>{PROPERTY_LESSON_TYPE === 'П' ? 'пр' : (PROPERTY_LESSON_TYPE === LessonTypes['лаб'] ? 'лаб' : 'лек')}</Text>

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

                    {/*<HStack w='100%' pos='absolute' bottom='-20px' px='26px' color='white' opacity={0.5} spacing='14px'>*/}
                    {/*    <Icon as={FaHandPointDown} boxSize='30px' />*/}
                    {/*    <Text fontSize='16px'>Изменение ДЗ - по кнопке</Text>*/}
                    {/*</HStack>*/}
                </motion.div>
            </AnimatePresence>
        </VStack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent w='90vw' boxShadow='0px 4px 20px 10px rgba(40, 60, 80, 0.3)'>
                <ModalHeader color='white'>{modalContent?.subject}</ModalHeader>
                <ModalCloseButton color='white' />
                <ModalBody bg='blue.900' py='20px'>
                    {modalContent?.content && <OrderedList color='white' spacing='10px'>
                        {modalContent.content.map((c: string, i: number) => <ListItem key={i} fontSize='15px'>{c}</ListItem>)}
                    </OrderedList>}
                    {modalContent?.image && <Image src={modalContent.image} alt='' maxH='250px' />}
                </ModalBody>
                <ModalFooter>
                    <VStack spacing='10px' align='end'>
                        <Text w='max-content' align='end' fontSize='13.5px' color='gray.500'>Обновлено: {modalContent?.updatedAt ?? 'unknown'}</Text>
                        <Button colorScheme='blue' onClick={() => router.push('/edit?open=' + Object.keys(HWTypes)[Object.values(HWTypes).findIndex((ht: string) => modalContent?.subject.toString().includes(ht))] ?? '')}>Изменить</Button>
                    </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
}