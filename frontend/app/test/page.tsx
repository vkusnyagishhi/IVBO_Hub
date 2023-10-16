'use client';
import { HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "@/redux/hooks";
import { setTable } from "@/redux/miscSlice";

export default function TestPage() {
    const dispatch = useDispatch();
    const { table: data, isLaptop } = useSelector(state => state.misc);
    const [[weekIndex, weekDayIndex], setSelected] = useState([0, 0]);

    useEffect(() => {
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setTable(res.data)));
    }, [dispatch]);

    return <VStack w='max-content'>
        <HStack w={isLaptop ? '47%' : '75%'} color='gray.500' spacing='22px' justify={isLaptop ? 'end' : 'center'}>
            {['неделя', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(d => <Text key={d}>{d}</Text>)}
        </HStack>

        {data.length > 0 && data.map((week: object[], i) => <HStack key={i} color='white' spacing='10px'>
            <Text w='20px' align='center'>{i + 1}</Text>

            {week.map((dayTable: any, j) => {
                const isEmpty = dayTable.every((l: any) => !l);
                let day = 7 * i + j + 1 - 4;
                let month = 0;

                if (day > 30 && day <= 61) {
                    day -= 30;
                    month = 9;
                } else if (day > 61 && day <= 91) {
                    day -= 61;
                    month = 10;
                } else if (day > 91 && day <= 121) {
                    day -= 91;
                    month = 11;
                }

                const cellColor = weekIndex === i && weekDayIndex === j
                    ? 'purple.500'
                    : new Date().getDate() === day && new Date().getMonth() === month
                        ? 'green.500'
                        : isEmpty
                            ? 'gray.500'
                            : 'blue.600';

                return <VStack w='30px' color='white' key={j} bg={cellColor} _hover={{ cursor: 'pointer' }} onClick={() => {
                    if (!isEmpty) setSelected([i, j]);
                }}>
                    {day > 0 && <Text>{day}</Text>}
                </VStack>;
            })}
        </HStack>)}

        {data[weekIndex] && data[weekIndex][weekDayIndex] && Object.keys(data[weekIndex][weekDayIndex]).length > 0
            ? <VStack>
                {Object.keys(data[weekIndex][weekDayIndex]).map((lesson: string, i) => {
                    const theLesson = data[weekIndex][weekDayIndex][lesson];
                    if (!theLesson) return <Text color='white'>{i + 1}. [ОКНО]</Text>;

                    const { PROPERTY_DISCIPLINE_NAME, PROPERTY_LESSON_TYPE, PROPERTY_LECTOR, PROPERTY_PLACE } = theLesson;

                    return <HStack key={i} color='white'>
                        <Text>{i + 1}. {PROPERTY_DISCIPLINE_NAME} {`//`} {PROPERTY_LESSON_TYPE} {`//`} {PROPERTY_LECTOR} {`//`} {PROPERTY_PLACE}</Text>
                    </HStack>;
                })}
            </VStack>
            : <Text color='white'>Пусто</Text>}
    </VStack>
}