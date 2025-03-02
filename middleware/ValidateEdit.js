const { body, validationResult } = require('express-validator');

const validateUser = [
    body('login')
        .trim()
        .notEmpty().withMessage('Логін є обов’язковим')
        .isLength({ min: 3 }).withMessage('Логін має містити не менше 3 символів'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email є обов’язковим')
        .isEmail().withMessage('Некоректний email'),

    body('phone')
        .trim()
        .notEmpty().withMessage('Телефон є обов’язковим')
        .matches(/^\+?\d{10,15}$/).withMessage('Некоректний номер телефону'),

    body('fullName')
        .trim()
        .notEmpty().withMessage('Повне ім’я є обов’язковим')
        .isLength({ min: 3 }).withMessage('Повне ім’я має містити не менше 3 символів'),

    body('region')
        .trim()
        .notEmpty().withMessage('Регіон є обов’язковим'),

    body('cpmsd')
        .trim()
        .notEmpty().withMessage('ЦПМСД є обов’язковим'),

    body('role')
        .trim()
        .notEmpty().withMessage('Роль є обов’язковою')
        .isIn(['nurse', 'seniorNurse', 'coordinatorDoctor', 'headCpmsd', 'supervisor', 'coordinatorRegion', 'coordinatorUa', 'adminRegion','adminCpmsd  ','mainAdmin'])
        .withMessage('Некоректна роль користувача'),

    body('approve')
        .optional()
        .isBoolean().withMessage('Поле approve має бути булевим значенням (true/false)'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateUser;
