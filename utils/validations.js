import { body } from 'express-validator';

export const login = [
    body('email', 'Электронды почта қате енгізілді!').isEmail(),
    body('password', 'Құпиясөз 8 символдан кем!').isLength({min: 8}),
];

export const register = [
    body('fullName', 'Қолданушы аты 3 символдан кем').isLength({min: 3}),
    body('email', 'Электронды почта қате енгізілді!').isEmail(),
    body('password', 'Құпиясөз 8 символдан кем!').isLength({min: 8}),
    body('avatarUrl', 'Қате сілтеме!').optional().isURL()
];

export const lessonForm = [
    body('content', 'Тақырып аты 3 символдан кем').isLength({min: 3}),
    body('key', 'Тақырып аты 3 символдан кем').isLength({min: 3}),
    body('title', 'Тақырып аты 3 символдан кем').isLength({min: 3})
];