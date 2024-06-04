import { z } from "zod";

export const userRole = z.union([z.literal("USER"), z.literal("ADMIN")], {
  required_error: "role is required",
});

export const userSchema = z.object({
  user_id: z.string({ required_error: "user_id is required" }),
  nick: z.string({ required_error: "nick is required" }).min(4),
  role: userRole,
  email: z.string({ required_error: "email is required" }).email(),
  name: z.string().optional(),
  surname: z.string().optional(),
  profil_image: z.string().optional(),
  creation_time: z.date().optional(),
});


export const additionalInformationUserSchema = z.object({
    uid: z.string({required_error: "Uid is required"}),
    email: z.string({ required_error: "Email is required" }),
    name: z.string({ required_error: "Name is required"}),
    surname: z.string({ required_error: "Surname is required" }),
    nick: z.string({ required_error: "Nick is required" })
})