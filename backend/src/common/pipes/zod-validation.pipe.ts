import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import type { ZodSchema, ZodError } from 'zod'; // 👈 IMPORT TYPE
import { ZodError as ZodErrorClass } from 'zod'; // 👈 IMPORTA A CLASSE PARA VERIFICAÇÃO

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    console.log('Validating value:', value);
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodErrorClass) {
        const formattedErrors = error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new BadRequestException({
          message: 'Erro de validação',
          errors: formattedErrors,
        });
      }
      throw new BadRequestException('Erro de validação desconhecido');
    }
  }
}
