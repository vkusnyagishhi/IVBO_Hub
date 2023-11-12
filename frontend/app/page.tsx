'use client';
import { Box, Button, HStack, Icon, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { FaBook, FaHouse } from "react-icons/fa6";
import { HWTypes, IHomework, ILesson, lessonIntervals, LessonTypes, months, weeksAndDays as rawWnD } from "@/utils/misc";
import { useRouter } from "next/navigation";
import { decreaseWeeksDisplayCount, increaseWeeksDisplayCount, setSelected, swipe } from "@/redux/miscSlice";
import { BiEdit } from "react-icons/bi";
import data from '@/utils/table';

const subjectCardStyles = {
    color: 'white',
    w: '100%',
    spacing: '8px',
    p: '10px',
    bg: 'whiteAlpha.200',
    borderRadius: '20px',
    boxShadow: '0px 0px 14px 0px rgba(255, 255, 255, 0.2)'
};

const weekIncrement = 10,
    minSwipeDistanceX = 40,
    minSwipeDistanceY = 30,
    weeksAndDays = rawWnD.slice(rawWnD.findIndex((x: number[]) => x.includes(new Date().getDate())));

export default function Calendar() {
    const { hw, isLaptop, calendarSelected: [weekIndex, weekDayIndex], weeksDisplayCount } = useSelector(state => state.misc);
    const [modalContent, setModalContent] = useState<IHomework>();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const router = useRouter();
    const dispatch = useDispatch();

    const [[touchStartX, touchStartY], setTouchStart] = useState([0, 0]);
    const [[touchEndX, touchEndY], setTouchEnd] = useState([0, 0]);
    const [rightDir, setRightDir] = useState(true);

    const slicedData = data.slice(weeksDisplayCount[0], -1 * weeksDisplayCount[1]);

    function onTouchStart(e: any) {
        setTouchEnd([0, 0]);
        setTouchStart([e.targetTouches[0].pageX, e.targetTouches[0].pageY]);
    }

    function onTouchMove(e: any) {
        // if (e.targetTouches[0].pageY < 170 + slicedData.length * 55) return; // deny scroll
        setTouchEnd([e.targetTouches[0].pageX, e.targetTouches[0].pageY]);
    }

    function onTouchEnd() {
        const distanceX = touchStartX - touchEndX;
        const distanceY = touchStartY - touchEndY;

        if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return; // skip clicks

        const absX = Math.abs(distanceX);
        const absY = Math.abs(distanceY);

        if (absY > minSwipeDistanceY && absX < minSwipeDistanceX) { // vertical swipe
            if (touchStartY > 170 + slicedData.length * 55) return; // if touchStart on calendar div

            const isUpSwipe = distanceY > minSwipeDistanceY;
            const isDownSwipe = distanceY < -minSwipeDistanceY;

            if (isUpSwipe || isDownSwipe) dispatch(isUpSwipe ? increaseWeeksDisplayCount() : decreaseWeeksDisplayCount());
        } else if (absX > minSwipeDistanceX) { // horizontal swipe
            const isLeftSwipe = distanceX > minSwipeDistanceX;
            const isRightSwipe = distanceX < -minSwipeDistanceX;

            if (isLeftSwipe || isRightSwipe) {
                setRightDir(isLeftSwipe);
                dispatch(swipe(isLeftSwipe ? 1 : -1));
            }
        }
    }

    return <>
        <VStack w='100%' h='100%' pt='30px' spacing={`${50 + slicedData.length * 52}px`} pos='relative' onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            {/*<Box w='200px' h='50px' border='2px solid red' pos='fixed' left={0} top={`${170 + slicedData.length * 55}px`} />*/}

            <Text pos='absolute' color='white' opacity={0.5} top='-7px' left={isLaptop ? '25%' : '5%'}>{months[new Date().getMonth()]}, {weekIncrement + weekIndex} неделя</Text>
            <Box />
            {/*<HStack pos='absolute' top='-8.3vh' left='50%'>*/}
            {/*    <Flex opacity={weeksDisplayCount < data.length - 2 ? 1 : 0.5} onClick={() => {*/}
            {/*        if (weeksDisplayCount < data.length - 2) {*/}
            {/*            dispatch(setWeeksDisplayCount(weeksDisplayCount + 1));*/}
            {/*            localStorage.setItem('weeksDisplayCount', `${weeksDisplayCount + 1}`);*/}
            {/*        }*/}
            {/*    }} border='2px solid white' borderRadius='25px 0 0 25px' color='white' p='4px'>*/}
            {/*        <Icon as={AiOutlineMinus} boxSize='18px' />*/}
            {/*    </Flex>*/}
            {/*    <Flex opacity={weeksDisplayCount > 1 ? 1 : 0.5} onClick={() => {*/}
            {/*        if (weeksDisplayCount > 1) {*/}
            {/*            dispatch(setWeeksDisplayCount(weeksDisplayCount - 1));*/}
            {/*            localStorage.setItem('weeksDisplayCount', `${weeksDisplayCount - 1}`);*/}
            {/*        }*/}
            {/*    }} border='2px solid white' borderRadius='0 25px 25px 0' color='white' p='4px'>*/}
            {/*        <Icon as={AiOutlinePlus} boxSize='18px' />*/}
            {/*    </Flex>*/}
            {/*</HStack>*/}

            <VStack w='100%' pos='absolute'>
                <HStack spacing='32px' color='gray.500'>
                    {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => <Text key={d}>{d}</Text>)}
                </HStack>

                {slicedData.map((week: object[], i) => <HStack key={i} color='white' spacing='10px'>
                    {week.map((dayTable: any, j) => {
                        const now = new Date();
                        const day = weeksAndDays[i + weeksDisplayCount[0]][j];
                        const month = i === 0 && weeksAndDays[i][j] >= 30
                            ? 9
                            : i >= 0 && i <= 3 && weeksAndDays[i][j] > 1
                                ? 10
                                : 11;

                        const isSelected = weekIndex === i && weekDayIndex === j;

                        return <VStack
                            w='40px'
                            h='40px'
                            color='white'
                            key={j}
                            _hover={{ cursor: 'pointer' }}
                            onClick={() => {
                                setRightDir(true);
                                dispatch(setSelected([i, j]));
                            }}
                            pos='relative'
                        >
                            <Text userSelect='none' pt='8px' zIndex={2}>{day}</Text>

                            <Box zIndex={1} w='75%' h='75%' borderRadius='200px' bg={isSelected ? 'linear-gradient(150deg, rgba(69,112,209,1) 0%, rgba(88,15,112,1) 100%)' : 'none'} opacity={isSelected ? 1 : 0} pos='absolute' transition='0.15s' top='5.5px' left='5px' />
                            {now.getDate() === day && now.getMonth() === month && <Box w='75%' h='75%' borderRadius='200px' bg='green.300' pos='absolute' top='5.5px' left='5px' opacity={0.5} />}

                            <HStack pos='absolute' bottom='-5px' spacing='2px'>
                                {/* @ts-ignore */}
                                {data[i + weeksDisplayCount[0]][j].filter((x: ILesson | null) => x?.PROPERTY_LESSON_TYPE).map((x: any, i: number) =>
                                    <Box key={i} w='6px' h='6px' bg={x.PROPERTY_LESSON_TYPE === 'П' ? 'blue.400' : (x.PROPERTY_LESSON_TYPE === 'ЛБ' ? 'red.300' : 'purple.500')} borderRadius='200px' />)}
                            </HStack>
                        </VStack>;
                    })}
                </HStack>)}
            </VStack>

            <AnimatePresence mode='wait'>
                <motion.div
                    style={{
                        overflowY: 'auto',
                        height: '58vh',
                        padding: isLaptop ? '20px 1% 70px 1%' : '20px 5% 110px 5%',
                        width: isLaptop ? '50%' : '100%',
                        position: 'relative',
                        borderRadius: '25px 25px 0 0',
                        boxShadow: '0px -4px 30px 2px rgba(255, 255, 255, 0.1)'
                    }}
                    initial={{ opacity: 0, x: rightDir ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: rightDir ? -10 : 10 }}
                    transition={{ duration: 0.15 }}
                    key={weekIndex + weekDayIndex}
                >
                    {data[weekIndex] && data[weekIndex][weekDayIndex] && Object.keys(data[weekIndex][weekDayIndex]).length > 0
                        ? <VStack key={weekIndex + weekDayIndex} spacing='18px'>
                            {Object.keys(data[weekIndex][weekDayIndex]).map((lesson: string, i) => {
                                // @ts-ignore
                                const theLesson: ILesson | null = data[weekIndex][weekDayIndex][lesson];
                                if (!theLesson) return <VStack key={i} opacity={0.8} {...subjectCardStyles}>
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
                                            <Text align='center' fontSize='14px' p='4px 10px' borderRadius='20px' bg='pink.500'>чилл</Text>

                                            <HStack bg='red.500' p='4px 12px' borderRadius='20px' fontWeight={600} spacing='6px'>
                                                <Icon as={FaHouse} />
                                                <Text fontSize='14px'>где</Text>
                                            </HStack>
                                        </HStack>
                                    </HStack>
                                </VStack>;

                                const { PROPERTY_DISCIPLINE_NAME, PROPERTY_LECTOR, PROPERTY_LESSON_TYPE, PROPERTY_PLACE } = theLesson;
                                const HW = hw.find((h: IHomework) =>
                                    h.subject.split(' ')[1] === HWTypes[PROPERTY_DISCIPLINE_NAME as keyof typeof HWTypes] &&
                                    (h.content || h.image)
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

                                        {
                                            Object.keys(HWTypes).includes(PROPERTY_DISCIPLINE_NAME) &&
                                            PROPERTY_LESSON_TYPE === LessonTypes['пр'] &&
                                            // new Date().getDate() === weeksAndDays[weekIndex + weeksDisplayCount[0]][weekDayIndex] &&
                                            // new Date().getMonth() === (weekIndex === 0 && weekDayIndex >= 30 ? 9 : weekIndex >= 0 && weekIndex <= 3 && weekDayIndex > 1 ? 10 : 11) &&
                                            <HStack borderRadius='20px' bg={HW ? 'green.500' : 'orange.400'} p='4px 18px' spacing='5px' boxShadow='0px 0px 10px 0px rgba(255, 255, 255, 0.35)' onClick={() => {
                                                if (HW) {
                                                    setModalContent(HW);
                                                    onOpen();
                                                } else router.push('/edit?open=' + PROPERTY_DISCIPLINE_NAME);
                                            }} _hover={{ cursor: 'pointer' }}>
                                                <Icon as={HW ? FaBook : BiEdit} boxSize='20px' pt='-2px' />
                                                <Text userSelect='none' fontWeight={500}>ДЗ</Text>
                                            </HStack>
                                        }
                                    </HStack>

                                    <HStack w='100%' justify='space-between' align='end'>
                                        <Text h='30px' color='gray.400' fontSize='14px' fontWeight={600} pt='5px' pl='4px'>{lessonIntervals[i]}</Text>

                                        <HStack spacing='8px' fontWeight={500}>
                                            <Text align='center' fontSize='14px' p='4px 10px' borderRadius='20px' bg={PROPERTY_LESSON_TYPE === LessonTypes['пр'] ? 'blue.500' : (PROPERTY_LESSON_TYPE === LessonTypes['лаб'] ? 'red.300' : 'purple.700')}>{PROPERTY_LESSON_TYPE === 'П' ? 'пр' : (PROPERTY_LESSON_TYPE === LessonTypes['лаб'] ? 'лаб' : 'лек')}</Text>

                                            <HStack bg='red.500' p='4px 12px' borderRadius='20px' fontWeight={600} spacing='6px'>
                                                <Icon as={FaHouse} />
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
            <ModalContent w='90vw' boxShadow='0px 4px 20px 10px rgba(40, 60, 80, 0.3)'>
                <ModalHeader color='white'>{modalContent?.subject}</ModalHeader>
                <ModalCloseButton color='white' />
                <ModalBody bg='blue.900' py='20px'>
                    {/* @ts-ignore */}
                    {modalContent?.content && modalContent.content.split('\n').map((c: string, i: number) => <Text fontSize='16px' color='white' key={i}>{c}</Text>)}
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