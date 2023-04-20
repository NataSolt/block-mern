import {body} from 'express-validator';

export const registerValidation = [
    body('email', 'Неверный формат').isEmail(),
    body('password', 'Пароль минимум 5 символов').isLength({min:5}),
    body('fullName', 'Укажите имя').isLength({min:3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(), //проверяет если придет на урл,если не придет ошибки не будет
]