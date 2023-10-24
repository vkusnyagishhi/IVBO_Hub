'use client';
import { useSelector } from "@/redux/hooks";
import { Text, VStack, Icon, SimpleGrid, Heading } from "@chakra-ui/react";
import { headerLinks } from "@/misc";
import { useRouter } from "next/navigation";

export default function Home() {
    const { isLaptop } = useSelector(state => state.misc);
    const router = useRouter();

    return <VStack spacing='30px'>
        <Heading color='white'>IVBO-11-23 Hub</Heading>

        <SimpleGrid columns={2} spacing='10px'>
            {headerLinks.map((link, i) => <VStack key={i} bg='blue.800' p='20px' borderRadius='20px' color='white' spacing='12px' onClick={() => router.push(link.pathname)} transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }}>
                <Icon as={link.icon} boxSize='40px' />
                <Text w='max-content' userSelect='none' fontSize='20px'>{link.title}</Text>
            </VStack>)}
        </SimpleGrid>
    </VStack>
}