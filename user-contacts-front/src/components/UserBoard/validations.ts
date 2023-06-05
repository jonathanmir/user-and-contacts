import { z } from "zod";
export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().optional(),
});
export type updateUserData = z.infer<typeof updateUserSchema>;
