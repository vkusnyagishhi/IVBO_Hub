'use client';
import { HStack, VStack, Icon, Text, Flex } from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { headerLinks } from '@/misc';
import { useSelector } from "@/redux/hooks";
import { BiEdit } from "react-icons/bi";

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { isLaptop } = useSelector(state => state.misc);

    return <HStack w='100%' borderRadius='25px 25px 0px 0px' h='80px' px={isLaptop ? '30vw' : '50px'} py='10px' bg='gray.700' pos='fixed' bottom={0} justify='space-between' zIndex={10}>
        {headerLinks.map((link, i) => <VStack key={i} w='50px' h='100%' color={pathname === link.pathname ? 'blue.300' : 'white'} spacing={0} onClick={() => router.push(link.pathname)} transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }}>
            <Icon as={link.icon} boxSize='50%' />
            <Text w='max-content' userSelect='none'>{link.title}</Text>
        </VStack>)}
    </HStack>
}