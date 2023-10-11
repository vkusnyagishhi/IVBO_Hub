import { MdLibraryBooks } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { BsFillFileEarmarkEaselFill } from "react-icons/bs";

export interface IHomework {
    subject: string;
    content: string[];
    image: string;
    updatedAt: string;
}

export interface IUser {
    tg_username: string;
    trusted: string[];
}

export const ease = [0.410, 0.030, 0.000, 0.995];
export const iconButtonStyles = {
    boxSize: '50px',
    fontSize: '20px',
    color: 'white',
    bg: 'gray.700',
    transition: '0.3s',
    _hover: { color: 'gray.300', cursor: 'pointer' },
    _active: { color: 'gray.500' }
};

export const toasts = {
    success: (desc: string): any => ({
        status: 'success',
        title: 'Успешно',
        description: desc,
        duration: 5000
    }),
    error: (desc?: string): any => ({
        status: 'error',
        title: 'Ошибка',
        description: desc ?? 'Обратитесь к админу',
        duration: 5000
    })
};

export const headerLinks = [
    {
        pathname: '/',
        icon: MdLibraryBooks,
        title: 'Домашка'
    },
    {
        pathname: '/admin',
        icon: BiEdit,
        title: 'Записать ДЗ'
    },
    {
        pathname: '/upload',
        icon: BsFillFileEarmarkEaselFill,
        title: 'Файлы'
    }
];