import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createCustomerSchema } from './customers.schema';
import type { CreateCustomerDto } from './customers.schema'; // 👈 IMPORT TYPE

@Controller('customers')
export class CustomersController {
  constructor(private readonly service: CustomersService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createCustomerSchema)) body: CreateCustomerDto,
  ) {
    return this.service.create(body);
  }
}
