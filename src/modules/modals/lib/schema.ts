import z from "zod";

export const createServerSchema = z.object({
  name: z
    .string()
    .min(1, "Server name is required")
    .max(100, "Server name must be under 100 characters")
    .trim(),
  imageUrl: z
    .string()
    .url("Please upload a valid image")
    .min(1, "Server image is required"),
});

export type CreateServerFormData = z.infer<typeof createServerSchema>;
