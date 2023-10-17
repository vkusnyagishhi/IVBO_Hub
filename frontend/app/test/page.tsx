'use client';
import { HStack, Text, VStack, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "@/redux/hooks";
import { setTable } from "@/redux/miscSlice";
import { motion } from "framer-motion";

export default function TestPage() {
    const dispatch = useDispatch();
    const { table: data, isLaptop } = useSelector(state => state.misc);
    const [[weekIndex, weekDayIndex], setSelected] = useState([0, 0]);

    useEffect(() => {
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setTable(res.data)));
    }, [dispatch]);

    return <VStack w='max-content'>
        <HStack ml='-47px' color='gray.500' spacing='22px' justify={isLaptop ? 'end' : 'center'}>
            {['неделя', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => <Text key={d}>{d}</Text>)}
        </HStack>

        {data.length > 0 && data.map((week: object[], i) => <HStack key={i} color='white' spacing='10px'>
            {week.map((dayTable: any, j) => {
                const isEmpty = dayTable.every((l: any) => !l);
                let day = i === 0 && j !== 6 ? 0 : 7 * i + j - 5;
                let month = 10;

                if (day > 31) {
                    day -= 31;
                    month = 11;
                }

                const cellColor = weekIndex === i && weekDayIndex === j
                    ? 'purple.500'
                    : new Date().getDate() === day && new Date().getMonth() === month
                        ? 'green.400'
                        : isEmpty
                            ? 'gray.600'
                            : 'blue.700';

                return <VStack w='30px' color='white' key={j} bg={cellColor} _hover={{ cursor: 'pointer' }} transition='0.2s' onClick={() => {
                    if (!isEmpty) setSelected([i, j]);
                }}>
                    {day > 0 && <Text>{day}</Text>}
                </VStack>;
            })}
        </HStack>)}

        <motion.div style={{ height: '20vh' }} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.3 }} key={weekIndex + weekDayIndex}>
            {data[weekIndex] && data[weekIndex][weekDayIndex] && Object.keys(data[weekIndex][weekDayIndex]).length > 0
                ? <VStack h='100%' border='2px solid red' key={weekIndex + weekDayIndex}>
                    {Object.keys(data[weekIndex][weekDayIndex]).map((lesson: string, i) => {
                        const theLesson = data[weekIndex][weekDayIndex][lesson];
                        if (!theLesson) return <Text color='white'>{i + 1}. [ОКНО]</Text>;

                        const { PROPERTY_DISCIPLINE_NAME, PROPERTY_LESSON_TYPE, PROPERTY_LECTOR, PROPERTY_PLACE } = theLesson;

                        return <HStack key={i} color='white'>
                            <Text>{i + 1}. {PROPERTY_DISCIPLINE_NAME} {`//`} {PROPERTY_LESSON_TYPE} {`//`} {PROPERTY_LECTOR} {`//`} {PROPERTY_PLACE}</Text>
                        </HStack>;
                    })}
                </VStack>
                : <Text color='white' h='100%'>Пар нет!</Text>}
        </motion.div>
    </VStack>
}