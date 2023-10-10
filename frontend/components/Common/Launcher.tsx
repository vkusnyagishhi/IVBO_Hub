'use client';
import { setIsLaptop } from "@/redux/miscSlice";
import { useEffect } from "react";
import { useDispatch } from '@/redux/hooks';

export function Launcher() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setIsLaptop(!window.matchMedia("(max-width: 600px)").matches));
    }, [dispatch]);

    return <></>
}