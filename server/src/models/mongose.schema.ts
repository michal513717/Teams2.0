import { ObjectId, Timestamp } from "mongodb";
import z from "zod";

export type UserDatabaseSchema = {
  _id: ObjectId;
  userName: string;
  password: string;
  create_at: Timestamp | Date;
};

export const ZodLoginUserSchema = z.object({
  userName: z.string().min(1),
  password: z.string().min(1)
});

export const ZodRegisterUserSchema = z.object({
  userName: z.string().min(5),
  password: z.string().min(3),
  confirmPassword: z.string().min(3),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const ZodGetUnreadMessagesSchema = z.object({
  userName: z.string()
});

export type ChatDatabaseSchema = {
  _id: ObjectId;
  members: string[];
  messages: ChatRecord[];
  total_messages: number;
};

export type ChatRecord = {
  sender: string;
  message: string;
  timestamp: Timestamp | Date;
};

export type ChatInitData = {
  from: string;
  to: string;
  message: string;
  timestamp: Date;
};
export type UnReadMessageSchema = {
  from: string;
  to: string;
};

export type ConversationData = ChatInitData;
