import * as Yup from 'yup';
import { RequestUrgencyEnum, UserTypeEnum } from './typings/models';

export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export const registerSchema = Yup.object().shape({
    username: Yup.string()
        .matches(/^\w+$/, 'Username must contain only letters and numbers')
        .required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^0\d{8}$/, 'Phone number must follow the pattern 0XXXXXXXX')
    .required('Phone number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters')
    .matches(/\d/, 'Password must include at least one digit')
    .required('Password is required'),
    repeatPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match!')
        .required('Repeat password is required'),
});

export const userTypeSchema = Yup.object().shape({
    type: Yup.string().oneOf([UserTypeEnum.BENEFICIARY, UserTypeEnum.VOLUNTEER]).required('User type is required'),
    availability: Yup.string().required("Please select your availability!"),
    skills: Yup.string().required("Skills field is required"),
    needs: Yup.string().required("Needs field is required"),
    location: Yup.string().required("Location field is required"),
});




export const beneficiaryPageSchema = Yup.object().shape({
    profileImg: Yup.string().url('Profile Image must be valid URL').optional(),
    needs: Yup.string().required("Needs field is required"),
    location: Yup.string().required("Location field is required"),
    email: Yup.string().email('Invalid email').required('Email is required'),
    username: Yup.string().min(3, 'Username must be at least 3 characters long').required('Username is required'),
    phone: Yup.string().matches(/^0\d{8}$/, 'Phone number must follow the pattern 0XXXXXXXX')
    .required('Phone number is required'),
   });



export const volunteerPageSchema = Yup.object().shape({
    profileImg: Yup.string().url('Profile Image must be valid URL').optional(),
    availability: Yup.string().required("Availability field is required"),
    skills: Yup.string().required("Skills field is required"),
    email: Yup.string().email('Invalid email').required('Email is required'),
    username: Yup.string().min(3, 'Username must be at least 3 characters long').required('Username is required'),
    phone: Yup.string().matches(/^0\d{8}$/, 'Phone number must follow the pattern 0XXXXXXXX')
    .required('Phone number is required'),
});

export const requestSchema = Yup.object().shape({
    title: Yup.string().min(3, 'Title is too short'),
    description: Yup.string().min(10, 'Description is too short'),
    location: Yup.object({
        address: Yup.string().required("Address is required"),
        lat:     Yup.number().required(),
        lng:     Yup.number().required(),
      }),
    urgency: Yup.string().required().oneOf([RequestUrgencyEnum.LOW, RequestUrgencyEnum.MEDIUM, RequestUrgencyEnum.HIGH], 'The urgency is not valid'),
})

export const reviewSchema = Yup.object().shape({
    requestId: Yup.string().required("Request ID is required"),
    rating: Yup.number()
        .required("Rating is required")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be more than 5"),
    comment: Yup.string()
        .max(500, "Comment is too long")
});

export const recoverySchema = Yup.object({
    email: Yup.string()
        .email("Invalid email format")
        .required("Email is required")
        })


        export const changePasswordSchema = Yup.object({
            newPassword: Yup.string().required("Password is required"),
            repeatPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match!')
                .required('Repeat password is required'),
        });
        