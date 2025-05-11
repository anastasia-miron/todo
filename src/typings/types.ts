import { JWTPayload } from "jose";
import {
  NotificationStatusEnum,
  RequestStatusEnum,
  RequestUrgencyEnum,
  UserModel,
  UserTypeEnum,
} from "./models";

export type ApiResponseSuccess<T> = {
  success: true;
  data: T;
};

export type ApiResponseError = {
  success: false;
  message: string;
  error?: { issues: unknown[] };
};

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export type AppJwtPayload = JWTPayload & {
  user: UserModel;
};
export interface LocationPayload {
  address: string;
  lat: number;
  lng: number;
}

export interface RequestPayload {
  title: string;
  description: string;
  location: LocationPayload;
  urgency: RequestUrgencyEnum;
}

export interface MessageRecievedPayload {
  id: string;
  title: string;
  description: string;
  status: RequestStatusEnum;
  urgency: RequestUrgencyEnum;
  unreadCount: number;
  lastMessage: {
    content: string;
    timestamp: string;
    isSystem: boolean;
    sender?: {
      id: string;
      username: string;
      profileImg: string | null;
    } | null;
  };
  beneficiary: {
    id: string;
    username: string;
    profileImg: string | null;
    isVerified: boolean;
  };
  volunteer: {
    id: string;
    username: string;
    profileImg: string | null;
    isVerified: boolean;
  } | null;
}

export interface NotificationPayload {
  id: string;
  requestId: string;
  recipientId: string | null;
  recipientRole: UserTypeEnum;
  status: NotificationStatusEnum;
  isRead: boolean;
  timestamp: Date;
  requestTitle: string;
  requestUrgency: string;
  volunteerId?: string | null;
  volunteerUsername?: string;
  volunteerProfileImg?: string | null;
  beneficiaryId?: string | null;
  beneficiaryUsername?: string;
  beneficiaryProfileImg?: string | null;
  rating?: number;
  ratingComment?: string;
}

export interface NotificationStatus {
  allowNotifications: boolean;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

export interface ServerSideEvent extends CustomEvent {
  data: string;
  type: string;
}
