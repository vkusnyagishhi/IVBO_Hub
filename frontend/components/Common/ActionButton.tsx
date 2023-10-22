'use client';
import { Flex, Icon } from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from "@/redux/hooks";
import { PiHouseBold } from "react-icons/pi";

export function ActionButton() {
    const router = useRouter();
    const pathname = usePathname();
    const { isLaptop } = useSelector(state => state.misc);

    return <>
        {pathname !== '/' && <Flex p='20px' borderRadius='full' color='white' bg='purple.500' pos='fixed' bottom='40px' right='40px' transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }} onClick={() => router.push('/')}>
            <Icon as={PiHouseBold} boxSize='30px' />
        </Flex>}
    </>

    // return <HStack w='100%' borderRadius='25px 25px 0px 0px' h='80px' px={isLaptop ? '30vw' : '50px'} py='10px' bg='gray.700' pos='fixed' bottom={0} justify='space-between' zIndex={10}>
    //     {headerLinks.map((link, i) => <VStack key={i} w='50px' h='100%' color={pathname === link.pathname ? 'blue.300' : 'white'} spacing={0} onClick={() => router.push(link.pathname)} transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }}>
    //         <Icon as={link.icon} boxSize='50%' />
    //         <Text w='max-content' userSelect='none'>{link.title}</Text>
    //     </VStack>)}
    // </HStack>
}