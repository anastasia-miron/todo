export enum UserTypeEnum {
    NONE = '',
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

export interface ProfileModel {
    id: string;
    username: string;
    email: string;
    profileImg: string | null;
    phone: string | null;
    type: UserTypeEnum;
    isVerified: boolean,
    createdAt: string;
    needs: string | null;
    location: string | null;
    availability: string | null;
    skills: string | null;
}

