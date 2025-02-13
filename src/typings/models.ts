export enum UserTypeEnum {
    NONE = 'none',
    BENEFICIARY = "beneficiary",
    VOLUNTEER = "volunteer"
}

export interface UserModel {
    id: string;
    username: string;
    email: string;
    profileImg: string | null;
    phone: string | null;
    type: UserTypeEnum;
    isVerified: boolean,
    createdAt: string
}

