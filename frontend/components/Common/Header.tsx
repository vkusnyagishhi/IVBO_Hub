'use client';
import {
    Button, HStack, Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    IconButton,
    VStack
} from "@chakra-ui/react";
import { EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { usePathname } from "next/navigation";
import { useRouter } from 'next/navigation';

export function Header() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const pathname = usePathname();
    const router = useRouter();

    return <>
        <IconButton aria-label='menu' bg="#153156" _hover={{ bg: '#1c4172' }} _active={{ bg: '#112948' }} zIndex={10} color='white' icon={pathname === '/' ? <EditIcon /> : <ArrowBackIcon />} onClick={() => {
            router.push(pathname === '/' ? '/admin' : '/');
        }} pos='fixed' bottom='30px' right='30px' boxSize='70px' fontSize='25px' borderRadius='200px' />

        <Drawer
            isOpen={isOpen}
            placement='bottom'
            onClose={onClose}
        >
            <DrawerOverlay />
            <DrawerContent color='white' bg='black'>
                <DrawerCloseButton />
                <DrawerHeader>Меню</DrawerHeader>

                <DrawerBody pb='20px'>
                    <VStack spacing='20px' w='100%'>
                        <Button w='50%' bg='gray.200' onClick={() => {
                            router.push('/');
                            onClose();
                        }}>Главная</Button>
                        <Button w='50%' bg='gray.200' onClick={() => {
                            router.push('/admin');
                            onClose();
                        }}>Админка</Button>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    </>
}