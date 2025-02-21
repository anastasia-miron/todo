import { JWTPayload } from "jose"
import { RequestUrgencyEnum, UserModel } from "./models"

export type ApiResponseSuccess<T> = {
    success: true
    data: T
}

export type ApiResponseError = {
    success: false,
    message: string,
    error?: { issues: unknown[] }
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;


export type AppJwtPayload = JWTPayload & {
    user: UserModel
}

export interface RequestPayload {
    title: string;
    description: string;
    location: string;
    urgency: RequestUrgencyEnum;
}

export interface ReviewPayload {
    rating: number;
    comment: string;
}

export interface ServerSideEvent extends CustomEvent {
    data: string;
    type: string;
}