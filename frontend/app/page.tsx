'use client';
import { useSelector } from "@/redux/hooks";
import { Image, Text, ListItem, OrderedList, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Spinner, Box, Flex, VStack } from "@chakra-ui/react";
import { IHomework } from "@/misc";
import Link from "next/link";

export default function Home() {
    const { hw, isLaptop } = useSelector(state => state.misc);

    return hw.length > 0
        ? <Accordion w={isLaptop ? '40%' : '90%'} color='white' allowToggle>
            {hw.filter((x: IHomework) => x.content.length > 0).map((x: IHomework, i) => <AccordionItem key={i}>
                <AccordionButton fontSize='18px' w='100%'>
                    <Text w='90%'>{x.subject}<br />Обновлено: {x.updatedAt}</Text>
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel fontSize='16px'>
                    {x.image && <Link href={x.image}>
                        <VStack w='100%' pb='20px'>
                            <Image src={x.image} alt='' maxH='250px' />
                        </VStack>
                    </Link>}

                    <OrderedList>
                        {x.content.map((c, i) => <ListItem key={i}>{c}</ListItem>)}
                    </OrderedList>
                </AccordionPanel>
            </AccordionItem>)}
        </Accordion>
        : <Spinner size='xl' color='blue.500' emptyColor='gray.400' />
}