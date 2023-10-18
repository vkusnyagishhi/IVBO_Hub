import { MdLibraryBooks } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { BsFillCalendarRangeFill, BsFillFileEarmarkEaselFill } from "react-icons/bs";

export interface IHomework {
    subject: string;
    content: string[];
    image: string | null;
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
        // id: 'success-toast',
        status: 'success',
        title: 'Успешно',
        description: desc,
        duration: 2000,
        isClosable: true,
        containerStyle: { marginBottom: '100px' }
    }),
    error: (desc?: string): any => ({
        // id: 'error-toast',
        status: 'error',
        title: 'Ошибка',
        description: desc ?? 'Обратитесь к админу',
        duration: 3000,
        isClosable: true,
        containerStyle: { marginBottom: '100px' }
    })
};

export const headerLinks = [
    {
        pathname: '/',
        icon: MdLibraryBooks,
        title: 'Домашка'
    },
    {
        pathname: '/calendar',
        icon: BsFillCalendarRangeFill,
        title: 'Календарь'
    },
    {
        pathname: '/upload',
        icon: BsFillFileEarmarkEaselFill,
        title: 'Файлы'
    }
];