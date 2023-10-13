'use client';
import { HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "@/redux/hooks";
import { setTable } from "@/redux/miscSlice";

export default function TestPage() {
    const dispatch = useDispatch();
    const { table: data } = useSelector(state => state.misc);
    const [[weekIndex, weekDayIndex], setSelected] = useState([0, 0]);

    useEffect(() => {
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setTable(res.data)));
    }, [dispatch]);

    return <VStack>
        {data.length > 0 && data.map((week: object[], i) => <HStack key={i}>
            {week.map((day: any, j) => {
                const isEmpty = day.every((l: any) => !l);
                let alloverDay = 7 * i + j - 4 + 1;

                const alloverMonth = Math.round(alloverDay / 31) + 8;
                console.log(alloverDay, alloverMonth);

                const lastDayOfMonth = new Date(2023, alloverMonth, 0).getDate();
                if (alloverDay > lastDayOfMonth) alloverDay -= lastDayOfMonth;

                const cellColor = weekIndex === i && weekDayIndex === j
                    ? 'red.300'
                    : new Date().getDate() === alloverDay
                        ? 'green.500'
                        : isEmpty
                            ? 'gray.500'
                            : 'blue.600';

                return <VStack w='30px' key={j} bg={cellColor} _hover={{ cursor: 'pointer' }} onClick={() => {
                    if (!isEmpty) setSelected([i, j]);
                }}>
                    {alloverDay > 0 && <Text color='white'>{alloverDay}</Text>}
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