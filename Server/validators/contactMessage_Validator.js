import z from "zod";

export const ContactSchema = z.object({
    message: z
             .string()
             .min(1, { message: "Password must be at least 1 characters long." })
             .max(300, { message: "Password must be no more than 300 characters." })

})