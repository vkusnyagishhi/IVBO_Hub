'use client';
import { setData, setIsLaptop, setTable } from "@/redux/miscSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from '@/redux/hooks';
import { setAuthData } from "@/redux/authSlice";
import axios from "axios";
import { Text } from "@chakra-ui/react";

export function Launcher() {
    const dispatch = useDispatch();
    const { version } = useSelector(state => state.misc);

    useEffect(() => {
        dispatch(setIsLaptop(!window.matchMedia("(max-width: 600px)").matches));
        axios.get('https://api.twodev.cc/ivbo/hw').then(res => dispatch(setData(res.data)));
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setTable(res.data)));

        if (localStorage.getItem('hash')) axios.post('https://api.twodev.cc/ivbo/login', { hash: localStorage.getItem('hash') }).then(res => {
            if (res.data === 500) localStorage.removeItem('hash');
            else dispatch(setAuthData(res.data));
        });
    }, [dispatch]);

    return <>
        <Text fontSize='14px' color='white' opacity={0.5} pos='fixed' top={2} right={3} zIndex={10}>{version}</Text>
    </>
}