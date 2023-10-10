'use client';
import { useSelector } from "@/redux/hooks";
import { Text, ListItem, OrderedList, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Spinner } from "@chakra-ui/react";
import { IHomework } from "@/misc";
import Image from "next/image";

export default function Home() {
    const { hw, isLaptop } = useSelector(state => state.misc);

    return hw.length > 0
        ? <Accordion w={isLaptop ? '40%' : '90%'} color='white' allowToggle>
            {hw.filter((x: IHomework) => x.content.length > 0 || x.image).map((x: IHomework, i) => <AccordionItem key={i}>
                <AccordionButton fontSize='18px' w='100%'>
                    <Text w='90%'>{x.subject}<br />Обновлено: {x.updatedAt}<br />{x.updatedBy && `Кем: ${x.updatedBy}`}</Text>
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel fontSize='16px'>
                    {x.image && <Image fill src={x.image} alt='' style={{ borderRadius: '20px' }} />}

                    <OrderedList>
                        {x.content.map((c, i) => <ListItem key={i}>{c}</ListItem>)}
                    </OrderedList>
                </AccordionPanel>
            </AccordionItem>)}
        </Accordion>
        : <Spinner size='xl' color='blue.500' emptyColor='gray.400' />
}