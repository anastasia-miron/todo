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
    rating: number;
    reviews: ReviewModel[]
}

export interface RequestModel {
    id: string;
    title: string;
    description: string;
    location: string;
    urgency: RequestUrgencyEnum;
    status: RequestStatusEnum;
    created_at: string;
    beneficiary: UserModel;
    volunteer: UserModel | null;
}

export interface ReviewModel {
    id: string;
    request: RequestModel;
    from: UserModel;
    to: UserModel;
    rating: number;
    comment: string;
    createdAt: string
}

export enum RequestUrgencyEnum {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

export enum RequestStatusEnum {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    CANCELED = "canceled",
    DONE = "done",
}

