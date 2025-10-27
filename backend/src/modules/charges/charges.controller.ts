import { Body, Controller, Post, UsePipes, Put } from '@nestjs/common';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ChargesService } from './charges.service';
import { createChargeSchema } from './charges.schema';

@Controller('charges')
export class ChargesController {
  constructor(private readonly service: ChargesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createChargeSchema))
  async create(@Body() body: any) {
    return this.service.create(body);
  }
  @Put()
  async updatePaymentStatus(@Body() body: any) {
    return this.service.updatePaymetStatus(body);
  }
}
