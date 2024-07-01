import { ObjectId } from "mongodb";
import z from "zod";

export type UserDatabaseSchema = {
  _id: ObjectId;
  userName: string;
  password: string;
  create_at: Date;
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