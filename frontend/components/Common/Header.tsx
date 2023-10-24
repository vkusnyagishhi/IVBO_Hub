'use client';
import { HStack, Icon, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from "@/redux/hooks";
import { headerLinks } from "@/misc";

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { isLaptop } = useSelector(state => state.misc);

    return <>
        {/*{pathname !== '/' && <HStack p='10px 20px' spacing='14px' borderRadius='full' color='white' bg='linear-gradient(174deg, rgba(69,112,209,1) 0%, rgba(88,15,112,1) 100%)' boxShadow='0px 4px 29px 14px rgba(34, 60, 80, 0.35)' pos='fixed' top='14px' left='20px' transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }} onClick={() => router.push('/')}>*/}
        {/*    <Icon as={PiHouseBold} boxSize='40px' />*/}
        {/*    /!*<Text fontSize='20px' fontWeight={700}>Назад</Text>*!/*/}
        {/*</HStack>}*/}

        <HStack w='100%' borderRadius='25px 25px 0px 0px' h='80px' py='10px' bg='#02203f' pos='fixed' bottom={0} justify='space-evenly' zIndex={10} spacing={0}>
            {headerLinks.map((link, i) => <HStack key={i} bg={pathname === link.pathname ? 'rgba(0,0,255,0.15)' : 'none'} color={pathname === link.pathname ? 'blue.400' : 'white'} p='10px 16px' borderRadius='full' spacing='10px' onClick={() => router.push(link.pathname)} transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }}>
                <Icon as={link.icon} boxSize='24px' />
                {pathname === link.pathname && <Text w='max-content' userSelect='none' fontSize='16px'>{link.title}</Text>}
            </HStack>)}
        </HStack>
    </>
}