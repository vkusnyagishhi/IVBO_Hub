'use client';
import { HStack, VStack, Icon, Text } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { headerLinks } from '@/misc';
import { useSelector } from "@/redux/hooks";

export function Header() {
    const router = useRouter();
    const { isLaptop } = useSelector(state => state.misc);

    return <HStack w='100%' borderRadius='25px 25px 0px 0px' h='80px' px={isLaptop ? '30vw' : '50px'} py='10px' bg='gray.700' pos='fixed' bottom={0} justify='space-between' zIndex={10}>
        {headerLinks.map((link, i) => <VStack key={i} w='50px' h='100%' color='white' spacing={0} onClick={() => router.push(link.pathname)} transition='0.3s' _hover={{ color: 'gray.300', cursor: 'pointer' }} _active={{ color: 'gray.500' }}>
            <Icon as={link.icon} boxSize='50%' />
            <Text w='max-content' userSelect='none'>{link.title}</Text>
        </VStack>)}
    </HStack>
}