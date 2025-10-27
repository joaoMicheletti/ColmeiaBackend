import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';


@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}
  // Método para criar um novo cliente
  async create(data: any) {
    try {
      let costomer =  await this.prisma.customer.create({ data });
      if(!costomer){
        throw new ConflictException('Erro ao cadastrar cliente.');
      } else {
        return {
          statusCode: 201,
          message: 'Cliente cadastrado com sucesso.',
          customer: costomer
        };
      }
    } catch (error) {
      // tratamento de erro para conflito de dados únicos (e-mail, documento)
      console.error('Error creating customer:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('E-mail ou documento já cadastrado.');
      }
      throw error;
    }
  }
}
