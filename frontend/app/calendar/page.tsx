'use client';
import { HStack, Text, VStack, Spinner, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "@/redux/hooks";
import { setTable } from "@/redux/miscSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FaHouse } from "react-icons/fa6";

export default function TestPage() {
    const dispatch = useDispatch();
    const { table: data } = useSelector(state => state.misc);
    const [[weekIndex, weekDayIndex], setSelected] = useState([1, 0]);

    useEffect(() => {
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setTable(res.data)));
    }, [dispatch]);

    return <VStack w='85%'>
        {/*<HStack ml='-47px' color='gray.500' spacing='22px' justify={isLaptop ? 'end' : 'center'}>*/}
        {/*    {['неделя', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => <Text key={d}>{d}</Text>)}*/}
        {/*</HStack>*/}

        {data.length > 0
            ? data.map((week: object[], i) => <HStack key={i} color='white' spacing='10px'>
                {week.map((dayTable: any, j) => {
                    const isEmpty = dayTable.every((l: any) => !l);
                    const now = new Date();
                    let day = 7 * i + j + 2;
                    let month = 10;

                    if (day > 31) {
                        day -= 31;
                        month = 11;
                    }

                    const cellColor = weekIndex === i && weekDayIndex === j
                        ? 'purple.500'
                        : now.getDate() === day && now.getMonth() === month
                            ? 'green.400'
                            : isEmpty
                                ? 'rgba(255,255,255,.3)'
                                : 'none';

                    return <VStack w='40px' h='40px' color='white' borderRadius='200px' key={j} bg={cellColor} _hover={{ cursor: 'pointer' }} transition='0.2s' onClick={() => {
                        if (!isEmpty) setSelected([i, j]);
                    }}>
                        {day > 0 && <Text userSelect='none' pt='8px'>{day}</Text>}
                    </VStack>;
                })}
            </HStack>)
            : <Spinner size='xl' color='blue.500' emptyColor='gray.400' />}

        <AnimatePresence mode='wait'>
            <motion.div style={{ width: '100%', height: '500px', marginTop: '20px' }} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.15 }} key={weekIndex + weekDayIndex}>
                {data[weekIndex] && data[weekIndex][weekDayIndex] && Object.keys(data[weekIndex][weekDayIndex]).length > 0
                    && <VStack h='100%' key={weekIndex + weekDayIndex}>
                        {Object.keys(data[weekIndex][weekDayIndex]).map((lesson: string, i) => {
                            const theLesson = data[weekIndex][weekDayIndex][lesson];
                            if (!theLesson) return <></>; // <Text color='white'>{i + 1}. [ОКНО]</Text>;

                            const { PROPERTY_DISCIPLINE_NAME, PROPERTY_LESSON_TYPE, PROPERTY_PLACE } = theLesson;

                            return <VStack key={i} color='white' w='100%' spacing='8px' p='10px' border='2px dotted blue' borderRadius='20px'>
                                <HStack spacing='10px' w='100%'>
                                    <Text w='30px' h='30px' borderRadius='full' bg={PROPERTY_LESSON_TYPE === 'П' ? 'blue.400' : 'purple.500'} align='center' pt='3px'>{i + 1}</Text>
                                    <Text w='50%'>{PROPERTY_DISCIPLINE_NAME}</Text>
                                </HStack>

                                <HStack spacing='10px' w='100%' justify='end'>
                                    <Text w='40px' h='100%' align='center' fontSize='14px' p='3px 4px 0px 4px' borderRadius='20px' bg={PROPERTY_LESSON_TYPE === 'П' ? 'blue.500' : 'purple.700'}>{PROPERTY_LESSON_TYPE === 'П' ? 'пр' : 'лек'}</Text>

                                    <HStack w='90px' h='100%' justify='center' bg='red.400' p='4px' borderRadius='20px'>
                                        <Icon as={FaHouse} />
                                        <Text fontSize='14px'>{PROPERTY_PLACE}</Text>
                                    </HStack>
                                </HStack>
                            </VStack>;
                        })}
                    </VStack>}
            </motion.div>
        </AnimatePresence>
    </VStack>
}