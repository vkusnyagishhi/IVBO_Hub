export interface IHomework {
    subject: string;
    content: string;
    image: string | null;
    updatedAt: string;
}

export interface IUser {
    tg_username: string;
    tg_id: number;
    tg_userpic: string | null;
    trusted: string[];
}

export interface ILesson {
    PROPERTY_DISCIPLINE_NAME: string;
    PROPERTY_LESSON_TYPE: LessonTypes;
    PROPERTY_LECTOR: string;
    PROPERTY_PLACE: string;
}

export enum LessonTypes {
    'пр' = 'П',
    'лек' = 'Л',
    'ЛАБ' = 'ЛАБ',
    'нг' = 'НГ',
    'ср' = 'СР'
}

export enum HWTypes {
    'Иностранный язык' = 'Англ',
    'Математический анализ' = 'МатАн',
    'Основы российской государственности' = 'ОРГ',
    'Физика' = 'Физика',
    'История России' = 'История',
    'Линейная алгебра и аналитическая геометрия' = 'ЛинАл',
    'НГ' = 'НГ',
    'СР' = 'СР'
}