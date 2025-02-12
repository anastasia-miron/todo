export enum UserTypeEnum {
    NONE = '',
    BENEFICIARY = "beneficiary",
    VOLUNTEER = "volunteer"
}

export interface UserModel {
    id: string;
    username: string;
    email: string;
    profile_img: string | null;
    phone: string | null;
    type: UserTypeEnum;
}

