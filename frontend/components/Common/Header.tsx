'use client';
import { HStack, Icon, Text, Tooltip } from "@chakra-ui/react";
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from "@/redux/hooks";
import { headerLinks } from "@/utils/misc";
import { ReactNode } from "react";

export function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { isLaptop } = useSelector(state => state.misc);

    return <HStack w='100%' borderRadius='25px 25px 0px 0px' h='80px' py='10px' bg='#02203f' pos='fixed' bottom={0} justify='space-evenly' zIndex={10} spacing={0}>
        {headerLinks.map((link, i) => {
            const TheStack = <HStack key={i} bg={pathname === link.pathname ? 'rgba(0,0,255,0.15)' : 'none'} color={pathname === link.pathname ? 'blue.400' : 'white'} p='10px 16px' borderRadius='full' spacing='10px' onClick={() => router.push(link.pathname)} transition='0.2s' _hover={isLaptop ? { cursor: 'pointer', color: 'blue.200' } : {}} _active={{ color: 'gray.500' }}>
                <Icon as={link.icon} boxSize='24px' />
                {pathname === link.pathname && <Text w='max-content' userSelect='none' fontSize='16px'>{link.title}</Text>}
            </HStack>;

            return (i === 0 && !localStorage.getItem('tooltip_shown') && false
                ? <Tooltip label='Записать ДЗ' placement='top' bg='green.600' borderRadius='25px' p='4px 8px 2px 8px' hasArrow defaultIsOpen>
                    {TheStack}
                </Tooltip>
                : TheStack) as ReactNode;
        })}
    </HStack>
}