import { z } from "zod";

export const createContactSchema = z.object({
  name: z.string().nonempty("Insira um nome"),
  email: z.string().email("Email Inválido"),
  phone: z.string().nonempty("Insira um número de telefone"),

});

export type createContactData = z.infer<typeof createContactSchema>;

export const updateContactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});
export type updateContactData = z.infer<typeof updateContactSchema>;
