import * as z from "zod"

export const userAuthSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long",
  }).optional(),
})

export type UserAuthSchema = z.infer<typeof userAuthSchema>
