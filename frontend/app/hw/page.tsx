'use client';
import { useSelector } from "@/redux/hooks";
import { Image, Text, ListItem, OrderedList, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Spinner, VStack, HStack, Icon, SimpleGrid, Flex } from "@chakra-ui/react";
import { headerLinks, IHomework } from "@/misc";
import Link from "next/link";
import { BiEdit } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const { hw, isLaptop } = useSelector(state => state.misc);
    const router = useRouter();

    return hw.length > 0
        ? <VStack spacing='20px' w={isLaptop ? '40%' : '90%'}>
            <HStack p='10px 20px' borderRadius='25px' color='white' bg='blue.500' justify='center' transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }} onClick={() => {
                setLoading(true);
                if (!loading) router.push('/edit');
            }}>
                {loading ? <Spinner boxSize='30px' /> : <Icon as={BiEdit} boxSize='30px' />}
                <Text>Изменить</Text>
            </HStack>

            <Accordion w='100%' color='white' allowToggle>
                {[...hw.filter(x => x.content.length > 0 || x.image), ...hw.filter(x => x.content.length <= 0 && !x.image)].map((x: IHomework, i) => <AccordionItem key={i}>
                    {x.content.length > 0 || x.image
                        ? <AccordionButton fontSize='18px' w='100%'>
                            <Text w='90%'>{x.subject}<br />Обновлено: {x.updatedAt}</Text>
                            <AccordionIcon />
                        </AccordionButton>
                        : <AccordionButton fontSize='18px' w='100%' opacity={0.5}>
                            <Text w='90%'>{x.subject}<br />Нет ДЗ</Text>
                        </AccordionButton>}

                    {(x.content.length > 0 || x.image) && <AccordionPanel fontSize='16px'>
                        {x.image && <Link href={x.image}>
                            <VStack w='100%' pb='20px'>
                                <Image src={x.image} alt='' maxH='250px' />
                            </VStack>
                        </Link>}

                        <OrderedList>
                            {x.content.map((c, i) => <ListItem key={i}>{c}</ListItem>)}
                        </OrderedList>
                    </AccordionPanel>}
                </AccordionItem>)}
            </Accordion>
        </VStack>
        : <Spinner size='xl' color='blue.500' emptyColor='gray.400' />
}