import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string().min(8, "Password should be at least 8 characters"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
