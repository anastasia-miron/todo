import * as Yup from 'yup';
import { RequestUrgencyEnum, UserTypeEnum } from './typings/models';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Email invalid').required('Emailul este obligatoriu'),
  password: Yup.string().required('Parola este obligatorie'),
});

export const registerSchema = Yup.object().shape({
  username: Yup.string()
      .matches(/^\w+$/, 'Numele de utilizator trebuie să conțină doar litere și cifre')
      .required('Numele de utilizator este obligatoriu'),
  email: Yup.string().email('Email invalid').required('Emailul este obligatoriu'),
  phone: Yup.string().matches(/^0\d{8}$/, 'Numărul de telefon trebuie să urmeze modelul 0XXXXXXXX')
  .required('Numărul de telefon este obligatoriu'),
  password: Yup.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere')
  .matches(/\d/, 'Parola trebuie să includă cel puțin o cifră')
  .required('Parola este obligatorie'),
  repeatPassword: Yup.string().oneOf([Yup.ref('password')], 'Parolele trebuie să coincidă!')
      .required('Confirmarea parolei este obligatorie'),
});

export const getUserTypeSchema = (type: UserTypeEnum) => {
  if (type === UserTypeEnum.BENEFICIARY) {
    return Yup.object().shape({
      type: Yup.string().oneOf([UserTypeEnum.BENEFICIARY, UserTypeEnum.VOLUNTEER]).required('Tipul utilizatorului este obligatoriu'),
      needs: Yup.string().required("Câmpul nevoi este obligatoriu"),
      location: Yup.string().required("Câmpul locație este obligatoriu"),
    });
  }

  if (type === UserTypeEnum.VOLUNTEER) {
    return Yup.object().shape({
      type: Yup.string().oneOf([UserTypeEnum.BENEFICIARY, UserTypeEnum.VOLUNTEER]).required('Tipul utilizatorului este obligatoriu'),
      availability: Yup.string().required("Te rugăm să selectezi disponibilitatea!"),
      skills: Yup.string().required("Câmpul aptitudini este obligatoriu"),
    });
  }

  // Schema implicită când tipul nu e selectat
  return Yup.object().shape({
    type: Yup.string().oneOf([UserTypeEnum.BENEFICIARY, UserTypeEnum.VOLUNTEER]).required('Tipul utilizatorului este obligatoriu'),
  });
};



export const beneficiaryPageSchema = Yup.object().shape({
  profileImg: Yup.string().url('Imaginea de profil trebuie să fie un URL valid').optional(),
  needs: Yup.string().required("Câmpul nevoi este obligatoriu"),
  location: Yup.string().required("Câmpul locație este obligatoriu"),
  email: Yup.string().email('Email invalid').required('Emailul este obligatoriu'),
  username: Yup.string().min(3, 'Numele de utilizator trebuie să aibă cel puțin 3 caractere').required('Numele de utilizator este obligatoriu'),
  phone: Yup.string().matches(/^0\d{8}$/, 'Numărul de telefon trebuie să urmeze modelul 0XXXXXXXX')
  .required('Numărul de telefon este obligatoriu'),
 });



 export const volunteerPageSchema = Yup.object().shape({
  profileImg: Yup.string().url('Imaginea de profil trebuie să fie un URL valid').optional(),
  availability: Yup.string().required("Câmpul disponibilitate este obligatoriu"),
  skills: Yup.string().required("Câmpul aptitudini este obligatoriu"),
  email: Yup.string().email('Email invalid').required('Emailul este obligatoriu'),
  username: Yup.string().min(3, 'Numele de utilizator trebuie să aibă cel puțin 3 caractere').required('Numele de utilizator este obligatoriu'),
  phone: Yup.string().matches(/^0\d{8}$/, 'Numărul de telefon trebuie să urmeze modelul 0XXXXXXXX')
  .required('Numărul de telefon este obligatoriu'),
});


export const requestSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Titlul este prea scurt'),
  description: Yup.string().min(10, 'Descrierea este prea scurtă'),
  location: Yup.object({
      address: Yup.string().required("Adresa este obligatorie"),
      lat:     Yup.number().required(),
      lng:     Yup.number().required(),
    }),
  urgency: Yup.string().required().oneOf([RequestUrgencyEnum.LOW, RequestUrgencyEnum.MEDIUM, RequestUrgencyEnum.HIGH], 'Urgenta nu este validă'),
});

export const reviewSchema = Yup.object().shape({
  requestId: Yup.string().required("ID-ul cererii este obligatoriu"),
  rating: Yup.number()
      .required("Evaluarea este obligatorie")
      .min(1, "Evaluarea trebuie să fie cel puțin 1")
      .max(5, "Evaluarea nu poate fi mai mare de 5"),
  comment: Yup.string()
      .max(500, "Comentariul este prea lung"),
});

export const recoverySchema = Yup.object({
  email: Yup.string()
      .email("Formatul emailului este invalid")
      .required("Emailul este obligatoriu"),
});


export const changePasswordSchema = Yup.object({
  newPassword: Yup.string().required("Parola este obligatorie"),
  repeatPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Parolele trebuie să coincidă!')
      .required('Confirmarea parolei este obligatorie'),
});