import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().nonempty("Insira um nome"),
  email: z.string().email("Email Inválido"),
  phone: z.string().nonempty("Insira um número de telefone"),
  password: z.string().nonempty("Insira uma senha de no mínimo 8 caracteres!"),
});

export type createUserData = z.infer<typeof createUserSchema>;
