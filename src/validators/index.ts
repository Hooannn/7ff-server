import { body } from 'express-validator';

export const emailValidator = () => body('email').isEmail();

export const passwordValidator = () => body('password').isLength({ min: 8, max: 25 });

export const emailAndPasswordValidator = () => [emailValidator(), passwordValidator()];
