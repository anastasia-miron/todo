import * as Yup from 'yup';
import { RequestUrgencyEnum, UserTypeEnum } from './typings/models';
import { user } from './mock';


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


export const beneficiaryPageSchema = Yup.object().shape({
    needs: Yup.string().required("Needs field is required"),
    location: Yup.string().required("Location field is required"),
    email: Yup.string().email('Invalid email').required('Email is required'),
    username: Yup.string().required('Username is required'),
});

export const volunteerPageSchema = Yup.object().shape({
    availability: Yup.string().required("Availability field is required"),
    skills: Yup.string().required("Skills field is required"),
    email: Yup.string().email('Invalid email').required('Email is required'),
    username: Yup.string().required('Username is required'),
});

export const requestSchema = Yup.object().shape({
    title: Yup.string(),
    description: Yup.string(),
    location: Yup.string(),
    urgency: Yup.string().oneOf([RequestUrgencyEnum.LOW, RequestUrgencyEnum.MEDIUM, RequestUrgencyEnum.HIGH])
})