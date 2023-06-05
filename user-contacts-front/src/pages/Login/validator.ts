import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido!").nonempty("Email inválido!"),
  password: z.string().nonempty("Senha obrigatória"),
});

export type LoginData = z.infer<typeof loginSchema>;
