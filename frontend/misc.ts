import { MdLibraryBooks } from "react-icons/md";
import { BsFillCalendarWeekFill, BsFillFileEarmarkEaselFill } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

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

export enum LessonTypes {
    'пр' = 'П',
    'лек' = 'Л'
}

export enum HWTypes {
    'Иностранный язык' = 'Англ',
    'Математический анализ' = 'МатАн',
    'Основы российской государственности' = 'ОРГ',
    'Физика' = 'Физика',
    'История России' = 'История',
    'Линейная алгебра и аналитическая геометрия' = 'ЛинАл'
}

// export const HWTypes = {
//     'Англ': 'Иностранный язык',
//     'МатАн': 'Математический анализ',
//     'ОРГ': 'Основы российской государственности',
//     'Физика': 'Физика',
//     'История': 'История России',
//     'ЛинАл': 'Линейная алгебра и аналитическая геометрия'
// }

export interface ILesson {
    PROPERTY_DISCIPLINE_NAME: string;
    PROPERTY_LESSON_TYPE: LessonTypes;
    PROPERTY_LECTOR: string;
    PROPERTY_PLACE: string;
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
        pathname: '/hw',
        icon: MdLibraryBooks,
        title: 'Домашка'
    },
    {
        pathname: '/edit',
        icon: BiEdit,
        title: 'Записать ДЗ'
    },
    {
        pathname: '/calendar',
        icon: BsFillCalendarWeekFill,
        title: 'Календарь'
    },
    {
        pathname: '/upload',
        icon: BsFillFileEarmarkEaselFill,
        title: 'Файлы'
    }
];