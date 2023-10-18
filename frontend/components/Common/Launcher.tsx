'use client';
import { setData, setIsLaptop } from "@/redux/miscSlice";
import { useEffect } from "react";
import { useDispatch } from '@/redux/hooks';
import { setAuthData } from "@/redux/authSlice";
import axios from "axios";

export function Launcher() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setIsLaptop(!window.matchMedia("(max-width: 600px)").matches));
        axios.get('https://api.twodev.cc/ivbo/hw').then(res => dispatch(setData(res.data)));

        if (localStorage.getItem('hash')) axios.post('https://api.twodev.cc/ivbo/login', { hash: localStorage.getItem('hash') }).then(res => {
            if (res.data === 500) localStorage.removeItem('hash');
            else dispatch(setAuthData(res.data));
        });
    }, [dispatch]);

    return <></>
}