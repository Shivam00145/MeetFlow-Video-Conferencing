import z from "zod";

 const nameSchema = z
  .string()
  .trim()
  .min(3, { message: "Name must be at least 3 characters long." })
  .max(100, { message: "Name must be no more than 100 characters." });


const emailSchema = z
  .string()
  .trim()
  .email({ message: "Please enter a valid email address." })
  .max(100, { message: "Email must be no more than 100 characters." });

const passwordSchema = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password must be no more than 100 characters." });

export const editPassword = z.object({
  previousPassword: passwordSchema,
  newPassword: passwordSchema,
});

export const editUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

export const loginUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerUserSchema = loginUserSchema.extend({
  name: nameSchema,
});