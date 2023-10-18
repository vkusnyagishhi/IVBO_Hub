'use client';
import { HStack, Text, VStack, Spinner, Icon, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "@/redux/hooks";
import { setTable } from "@/redux/miscSlice";
import { AnimatePresence, motion } from "framer-motion";
import { FaHouse } from "react-icons/fa6";

export default function Calendar() {
    const dispatch = useDispatch();
    const { table: data } = useSelector(state => state.misc);
    const [[weekIndex, weekDayIndex], setSelected] = useState([0, 6]);

    useEffect(() => {
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setTable(res.data)));
    }, [dispatch]);

    return <VStack w='85%'>
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
                            ? 'purple.500'
                            : now.getDate() === day && now.getMonth() === month
                                ? 'green.400'
                                : 'none';

                    return <VStack w='40px' h='40px' color='white' borderRadius='200px' key={j} bg={cellColor} _hover={{ cursor: 'pointer' }} transition='0.2s' onClick={() => {
                        if (!isEmpty) setSelected([i, j]);
                    }} pos='relative'>
                        {day > 0 && <Text userSelect='none' pt='8px'>{day}</Text>}

                        <HStack pos='absolute' bottom={0}>
                            {data[i][j].map((x: any) => x?.PROPERTY_LESSON_TYPE).filter((x: any) => x).map((x: any, i) =>
                                <Box key={i} w='6px' h='6px' bg={x === 'П' ? 'blue.400' : 'purple.500'} borderRadius='200px' />)}
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
                            const theLesson = data[weekIndex][weekDayIndex][lesson];
                            if (!theLesson) return <></>; // <Text color='white'>{i + 1}. [ОКНО]</Text>;

                            const { PROPERTY_DISCIPLINE_NAME, PROPERTY_LESSON_TYPE, PROPERTY_PLACE } = theLesson;

                            return <VStack key={i} color='white' w='100%' spacing='8px' p='10px' border='2px dotted blue' borderRadius='20px'>
                                <HStack spacing='10px' w='100%'>
                                    <Text w='30px' h='30px' borderRadius='full' bg={PROPERTY_LESSON_TYPE === 'П' ? 'blue.400' : 'purple.500'} align='center' pt='3px'>{i + 1}</Text>
                                    <Text w='80%'>{PROPERTY_DISCIPLINE_NAME}</Text>
                                </HStack>

                                <HStack spacing='8px' w='100%' justify='end'>
                                    <Text w='40px' align='center' fontSize='14px' p='4px' borderRadius='20px' bg={PROPERTY_LESSON_TYPE === 'П' ? 'blue.500' : 'purple.700'}>{PROPERTY_LESSON_TYPE === 'П' ? 'пр' : 'лек'}</Text>

                                    <HStack bg='red.400' p='4px 10px' borderRadius='20px'>
                                        <Icon as={FaHouse} mt='-2px' />
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