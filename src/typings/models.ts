import { LocationPayload } from "./types";

export enum UserTypeEnum {
  NONE = "",
  BENEFICIARY = "beneficiary",
  VOLUNTEER = "volunteer",
}

export interface UserModel {
  id: string;
  username: string;
  email: string;
  profileImg: string | null;
  phone: string | null;
  type: UserTypeEnum;
  isVerified: boolean;
  isFirstVisit: boolean;
  createdAt: string;
}

export interface RegionsModel {
  code: string;
  id: string;
  iso: string;
  name: string;
}

export interface ProfileModel {
  id: string;
  username: string;
  email: string;
  profileImg: string | null;
  phone: string | null;
  type: UserTypeEnum;
  isVerified: boolean;
  createdAt: string;
  needs: string | null;
  location: string | null;
  regions: RegionsModel[] | null;
  availability: string | null;
  skills: string | null;
  rating: number;
  reviews: ReviewModel[];
}

export interface RequestModel {
  id: string;
  title: string;
  description: string;
  location: LocationPayload;
  urgency: RequestUrgencyEnum;
  status: RequestStatusEnum;
  created_at: string;
  beneficiary: UserModel;
  beneficiary_id: string;
  volunteer: UserModel | null;
  volunteer_id: string | null;
}

export interface ReviewModel {
  id: string;
  request: RequestModel;
  from: UserModel;
  to: UserModel;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface MessageModel {
  id: string;
  request: RequestModel;
  user: UserModel | null;
  content: string;
  isSystem: boolean;
  timestamp: string;
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
  REJECTED = "rejected",
  DONE = "done",
}

export enum NotificationStatusEnum {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CANCELED = "canceled",
  REJECTED = "rejected",
  RATED = "rated",
  DONE = "done",
}
