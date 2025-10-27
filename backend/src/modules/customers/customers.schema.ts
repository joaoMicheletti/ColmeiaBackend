import { z } from 'zod';

// Schema para criação de clientes
export const createCustomerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  document: z
    .string()
    .min(11, 'Documento deve ter pelo menos 11 dígitos')
    .max(14, 'Documento inválido'),
  phone: z
    .string()
    .min(10, 'Telefone deve ter DDD e número')
    .regex(/^\d+$/, 'Telefone deve conter apenas números'),
});

// Tipagem automática com base no schema
export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
