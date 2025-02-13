import * as Yup from 'yup';
import { UserTypeEnum } from './typings/models';


export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export const registerSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Number is required'),
    password: Yup.string().required('Password is required'),
    repeatPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match!')
        .required('Repeat password is required'),
});

export const userTypeSchema = Yup.object().shape({
    type: Yup.string().oneOf([UserTypeEnum.BENEFICIARY, UserTypeEnum.VOLUNTEER]).required('User type is required'),
    
});
