'use client';
import { setData, setIsLaptop } from "@/redux/miscSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from '@/redux/hooks';
import { setAuthData } from "@/redux/authSlice";
import axios from "axios";
import { Text } from "@chakra-ui/react";

export function Launcher() {
    const dispatch = useDispatch();
    const { version } = useSelector(state => state.misc);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(setIsLaptop(!window.matchMedia("(max-width: 600px)").matches));
        axios.get('https://api.twodev.cc/ivbo/data').then(res => dispatch(setData(res.data)));

        if (localStorage.getItem('hash') && !user) axios.post('https://api.twodev.cc/ivbo/login', { hash: localStorage.getItem('hash') }).then(res => {
            if (res.data === 500) {
                localStorage.removeItem('hash');
                dispatch({ type: 'socket/connect', payload: 'unknown' });
            } else {
                dispatch(setAuthData(res.data));
                dispatch({ type: 'socket/connect', payload: res.data.user.tg_id.toString() });
            }
        });
        else dispatch({ type: 'socket/connect', payload: 'unknown' });
    }, [dispatch, user]);

    return <>
        <Text fontSize='14px' color='white' opacity={0.5} pos='fixed' top={2} right={3} zIndex={10}>{version}</Text>
    </>
}