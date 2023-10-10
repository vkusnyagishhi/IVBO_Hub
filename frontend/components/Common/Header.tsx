'use client';
import { Button, HStack, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Header() {
    const router = useRouter();

    return <HStack w='100%' justify='center' align='center' pos='fixed' top={0} h='70px' color='white'>
        <Button onClick={() => router.push('/')}>Главная</Button>
        <Button onClick={() => router.push('/admin')}>Админка</Button>
    </HStack>
}