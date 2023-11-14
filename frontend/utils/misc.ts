import { BsFillCalendarWeekFill, BsFillFileEarmarkEaselFill } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";

export const lessonIntervals = ['9:00 - 10:30', '10:40 - 12:10', '12:40 - 14:10', '14:20 - 15:50', '16:20 - 17:50', '18:00 - 19:30'];
export const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

// export const HWTypes = {
//     'Англ': 'Иностранный язык',
//     'МатАн': 'Математический анализ',
//     'ОРГ': 'Основы российской государственности',
//     'Физика': 'Физика',
//     'История': 'История России',
//     'ЛинАл': 'Линейная алгебра и аналитическая геометрия'
// }

export const gradients = {
    teal: 'linear-gradient(155deg, rgba(0,128,128,1) 0%, rgba(56,161,105,1) 100%)',
    orange: 'linear-gradient(155deg, rgba(237,127,54,1) 0%, rgba(237,155,54,1) 100%)',
    purple: 'linear-gradient(150deg, rgba(69,112,209,1) 0%, rgba(88,15,112,1) 100%)'
};

export const weeksAndDays = [
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31],
    [1, 2, 3, 4, 5, 6, 7]
];

export const ease = [0.410, 0.030, 0.000, 0.995];
export const iconButtonStyles = {
    boxSize: '40px',
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
    // {
    //     pathname: '/hw',
    //     icon: MdLibraryBooks,
    //     title: 'Домашка'
    // },
    {
        pathname: '/edit',
        icon: BiEdit,
        title: 'Записать ДЗ'
    },
    {
        pathname: '/',
        icon: BsFillCalendarWeekFill,
        title: 'Календарь'
    },
    {
        pathname: '/upload',
        icon: BsFillFileEarmarkEaselFill,
        title: 'Файлы'
    }
];