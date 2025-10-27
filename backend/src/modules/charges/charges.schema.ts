import { z } from 'zod';

export const createChargeSchema = z.object({
  amount: z.number().positive({
    message: 'O valor da cobrança deve ser um número positivo.',
  }),
  currency: z.string().optional().default('BRL'),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'BOLETO'], {
    message: 'Método de pagamento inválido. Use PIX, CREDIT_CARD ou BOLETO.',
  }),
  customerId: z.string().uuid({
    message: 'O ID do cliente deve ser um UUID válido.',
  }),
  installments: z.number().optional(),
  dueDate: z.string().optional(), // ou Date se for convertido no controller
  idempotencyKey: z.string().min(5, {
    message: 'idempotencyKey é obrigatório e deve ter ao menos 5 caracteres.',
  }),
});
