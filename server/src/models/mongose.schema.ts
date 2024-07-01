import { ObjectId } from "mongodb";
import z from "zod";

export type UserSchema = {
  _id: ObjectId;
  userName: string;
  password: string;
  create_at: Date;
};

export const ZodUserSchema = z.object({
  userName: z.string().min(5),
  password: z.string().min(3),
  confirmPassword: z.string().min(3),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});