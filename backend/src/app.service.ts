import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {} // Injeção de dependência

  async getHello() {
    // Exemplo de busca no banco
    const users = await this.prisma.$connect();
    return users;
  }
}
