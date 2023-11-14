'use client';
import { Avatar, Heading, HStack, Icon, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from "@/redux/hooks";
import { headerLinks } from "@/utils/misc";

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { isLaptop } = useSelector(state => state.misc);
    const { user, userpic } = useSelector(state => state.auth);

    return <>
        <HStack w='100%' h='110px' pb='14px' px={isLaptop ? '30%' : '5%'} justify='space-between' align='end' zIndex={10} bg='black' color='white'>
            <Heading fontSize='28px'>{headerLinks.find((hl: any) => pathname === hl.pathname)?.title ?? 'IVBO Hub'}</Heading>
            {userpic && <Avatar name={user?.tg_username} src={userpic ?? ''} boxShadow='0px 0px 8px 0px rgba(255, 255, 255, 0.2)' />}
        </HStack>

        <HStack w='100%' px={isLaptop ? '25%' : 0} borderRadius='25px 25px 0 0' h='70px' bg='#050505' pos='fixed' bottom={0} justify='space-evenly' zIndex={10} boxShadow='0px 4px 20px 0px rgba(255, 255, 255, 0.15)'>
            {headerLinks.map((link, i) => <HStack key={i} color={pathname === link.pathname ? 'white' : 'gray.500'} p='10px 16px' borderRadius='full' spacing='12px' onClick={() => router.push(link.pathname)} transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }}>
                <Icon as={link.icon} boxSize='30px' />
                {pathname === link.pathname && <Text w='max-content' userSelect='none' fontSize='17px'>{link.title}</Text>}
            </HStack>)}
        </HStack>

        {/*<HStack w='100%' borderRadius='25px 25px 0px 0px' h='80px' bg='#02203f' pos='fixed' bottom={0} justify='space-evenly' zIndex={10} spacing={0}>*/}
        {/*    {headerLinks.map((link, i) => <HStack key={i} bg={pathname === link.pathname ? 'rgba(0,0,255,0.15)' : 'none'} color={pathname === link.pathname ? 'blue.400' : 'white'} p='10px 16px' borderRadius='full' spacing='10px' onClick={() => router.push(link.pathname)} transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }}>*/}
        {/*        <Icon as={link.icon} boxSize='24px' />*/}
        {/*        {pathname === link.pathname && <Text w='max-content' userSelect='none' fontSize='16px'>{link.title}</Text>}*/}
        {/*    </HStack>)}*/}
        {/*</HStack>*/}

        {/*<VStack>*/}
        {/*    <Box w='100%' h='100px' bg='linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)' pos='fixed' bottom={0} zIndex={5} />*/}
        {/*</VStack>*/}
    </>
}