'use client';
import { setData, setIsLaptop } from "@/redux/miscSlice";
import { useEffect } from "react";
import { useDispatch } from '@/redux/hooks';
import api from "@/api";

export function Launcher() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setIsLaptop(!window.matchMedia("(max-width: 600px)").matches));
        api.get('/hw').then(res => dispatch(setData(res.data)));
    }, [dispatch]);

    return <></>
}