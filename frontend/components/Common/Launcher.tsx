'use client';
import { setData, setIsLaptop } from "@/redux/miscSlice";
import { useEffect } from "react";
import { useDispatch } from '@/redux/hooks';
import api from "@/api";
import { setAuthData } from "@/redux/authSlice";

export function Launcher() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setIsLaptop(!window.matchMedia("(max-width: 600px)").matches));
        api.get('/hw').then(res => dispatch(setData(res.data)));
        if (localStorage.getItem('hash')) api.post('/login', { hash: localStorage.getItem('hash') }).then(res => {
            if (res.data === 500) localStorage.removeItem('hash');
            else dispatch(setAuthData(res.data));
        });
    }, [dispatch]);

    return <></>
}