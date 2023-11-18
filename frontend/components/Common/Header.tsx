'use client';
import { Avatar, Button, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Heading, HStack, Icon, IconButton, Image, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from "@/redux/hooks";
import { headerLinks } from "@/utils/misc";

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { isLaptop } = useSelector(state => state.misc);
    const { user, userpic } = useSelector(state => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return <>
        <IconButton pos='fixed' animation='rotating 3s linear infinite' transition='0.45s' _hover={{}} _active={{}} top='52px' left={isOpen ? '230px' : '20px'} zIndex={1401} icon={<Image src='/logo.png' borderRadius='full' alt='' />} w='60px' bg='none' onClick={isOpen ? onClose : onOpen} aria-label='openHeader' />

        <HStack w='100%' h='140px' px={isLaptop ? '30%' : '5%'} justify='start' spacing='24px' align='end' zIndex={10} bg='black' color='white'>
            <Heading fontSize='28px'>{headerLinks.find((hl: any) => pathname === hl.pathname)?.title ?? 'IVBO Hub'}</Heading>
            {/*{userpic && <Avatar name={user?.tg_username} src={userpic ?? ''} boxShadow='0px 0px 8px 0px rgba(255, 255, 255, 0.2)' />}*/}
        </HStack>

        <HStack w='100%' px={isLaptop ? '25%' : 0} borderRadius='25px 25px 0 0' h='70px' bg='#050505' pos='fixed' bottom={0} justify='space-evenly' zIndex={10} boxShadow='0px 4px 20px 0px rgba(255, 255, 255, 0.15)'>
            {headerLinks.map((link, i) => <HStack key={i} color={pathname === link.pathname ? 'white' : 'gray.500'} p='10px 16px' borderRadius='full' spacing='12px' onClick={() => router.push(link.pathname)} transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }}>
                <Icon as={link.icon} boxSize='30px' />
                {pathname === link.pathname && <Text w='max-content' userSelect='none' fontSize='17px'>{link.title}</Text>}
            </HStack>)}
        </HStack>

        <Drawer isOpen={isOpen} placement='left' onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader bg='gray.900' color='white'>
                    <HStack h='120px' spacing='16px'>
                        {userpic && <Avatar name={user?.tg_username} src={userpic ?? ''} boxShadow='0px 0px 8px 0px rgba(255, 255, 255, 0.2)' />}
                        <VStack align='start' spacing='2px'>
                            <Text fontWeight={600}>pablo</Text>
                            <Text fontSize='16px' opacity={0.5} fontWeight={400}>123</Text>
                        </VStack>
                    </HStack>
                </DrawerHeader>

                <DrawerBody bg='black'>
                    <VStack w='100%' spacing='14px' py='20px'>
                        {headerLinks.map((link: any, i: number) => <>
                            <HStack w='100%' color='white' spacing='20px' pl='8px' onClick={() => router.push(link.pathname)}>
                                <Icon as={link.icon} boxSize='30px' />
                                <Text>{link.title}</Text>
                            </HStack>
                            {i < headerLinks.length - 1 && <Divider opacity={0.25} />}
                        </>)}
                    </VStack>
                </DrawerBody>

                <DrawerFooter>
                    <Button colorScheme='yellow' w='100%' borderRadius='full' onClick={onClose}>Закрыть</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

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