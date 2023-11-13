'use client';
import { setData, setIsLaptop } from "@/redux/miscSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from '@/redux/hooks';
import { setAuthData, setUserpic } from "@/redux/authSlice";
import axios from "axios";
import { Text } from "@chakra-ui/react";

export function Launcher() {
    const dispatch = useDispatch();
    const { version } = useSelector(state => state.misc);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (localStorage.getItem('ivbo_data')) dispatch(setData(JSON.parse(localStorage.getItem('ivbo_data') ?? '{}')));
        if (!version.includes('v')) axios.get('https://api.twodev.cc/ivbo/data').then(res => {
            dispatch(setData(res.data));
            localStorage.setItem('ivbo_data', JSON.stringify(res.data).replace('v', 'x'));
        });

        dispatch(setIsLaptop(!window.matchMedia("(max-width: 600px)").matches));
        if (localStorage.getItem('tg_userpic')) dispatch(setUserpic(localStorage.getItem('tg_userpic') ?? ''));
        // if (localStorage.getItem('weeksDisplayCount')) dispatch(setWeeksDisplayCount(localStorage.getItem('weeksDisplayCount') ?? '0|5'));

        // if (!localStorage.getItem('weeksDisplayCount')) localStorage.setItem('weeksDisplayCount', '4');
        // else dispatch(setWeeksDisplayCount(parseInt(localStorage.getItem('weeksDisplayCount') ?? '4')));

        if (localStorage.getItem('ivbo_token')) axios.post('https://api.twodev.cc/ivbo/login', { hash: localStorage.getItem('ivbo_token') }).then(res => {
            if (res.data === 500) {
                localStorage.removeItem('ivbo_token');
                dispatch({ type: 'socket/connect', payload: 'unknown' });
            } else {
                dispatch(setAuthData(res.data));
                dispatch({ type: 'socket/connect', payload: res.data.user.tg_id.toString() });
            }
        });
        else dispatch({ type: 'socket/connect', payload: 'unknown' });
    }, [dispatch, user, version]);

    return <>
        <Text fontSize='14px' color='white' opacity={0.5} pos='fixed' top={2} right={3} zIndex={10}>{version}</Text>
    </>
}