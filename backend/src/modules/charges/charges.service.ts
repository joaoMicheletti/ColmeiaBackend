import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChargesService {
  constructor(private prisma: PrismaService) {}
  // Cria uma nova charge com base nos dados fornecidos
  async create(data: any) {
    console.log('📦 Dados recebidos para criar charge:', data);
    // para Boleto é necessário o envio da data de vencimento
    if(data.paymentMethod === 'BOLETO') {
      let verification = data.dueDate;
      if(!verification) {
        throw new ConflictException('Para o método de pagamento BOLETO, a data de vencimento (DueDate) é obrigatória.');
      };

    } // para cartão de crédito, é necessáro o envio da quantidade de parcelas. 
    else if(data.paymentMethod === 'CREDIT_CARD') {
      let verification = data.installments;
      if(!verification) {
        throw new ConflictException('Para o método de pagamento CREDIT_CARD, a quantidade de parcelas (installments) é obrigatória.');
      };
    }
    try {
      let createCharger = await this.prisma.charge.create({ data });
      if (!createCharger) {
        throw new ConflictException('Erro ao criar a cobrança.');
      } else {
        return {
          statusCode: 201,
          message: 'Cobrança criada com sucesso.',
          charge: createCharger,
        };
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined;
        if (target && target.includes('idempotencyKey')) {
          throw new ConflictException('Duplicidade detectada: essa cobrança já foi registrada.');
        }
      }
      throw error;
    }

  };
  
  // atualizar status de pagametno:
  async updatePaymetStatus(data: any){
    console.log('🔄 Dados recebidos para atualizar status de pagamento:', data);
    const { chargeId, status } = data;
    // vamos pegar o pagamento com o id fornecido pelo usuário
    const charge = await this.prisma.charge.findUnique({
      where: { id: chargeId },
    });
    console.log('🔍 Charge encontrada:', charge);
    // vamos verificar se a charge existe
    if (!charge) {
      throw new ConflictException('Cobrança não encontrada com o ID fornecido.');
    };
    // vamos verificar o tipo da cobrança pix, boleto ou cartão de crédito
    if(charge.paymentMethod === 'PIX') {
      // vamos atualizar o status do pagamento para o valor fornecido
      let update =  await this.prisma.charge.update({
        where: { id: chargeId },
        data: { status},
      });

      if(!update) {
        throw new ConflictException('Erro ao atualizar o status do pagamento PIX.');
      } else {
        return {
          statusCode: 200,
          message: 'Status do pagamento PIX atualizado com sucesso.',
          charge: update
        }
      }
    } 
    // para boleto, só pode ser atualizado para PAID ou failed
    else if(charge.paymentMethod === 'BOLETO') {
      if(status !== 'PAID' && status !== 'FAILED') {
        throw new ConflictException('Para boletos, o status só pode ser atualizado para PAID ou FAILED.');
      };
      let update =  await this.prisma.charge.update({
        where: { id: chargeId },
        data: { status},
      });

      if(!update) {
        throw new ConflictException('Erro ao atualizar o status do pagamento BOLETO.');
      } else {
        return {
          statusCode: 200,
          message: 'Status do pagamento BOLETO atualizado com sucesso.',
          charge: update
        }
      };
    }
    // para cartão de crédito, só pode ser atualizado para PAID ou FAILED
    else if(charge.paymentMethod === 'CREDIT_CARD') {
      if(status !== 'PAID' && status !== 'FAILED') {
        throw new ConflictException('Para cartão de crédito, o status só pode ser atualizado para PAID ou FAILED.');
      };
      let update =  await this.prisma.charge.update({
        where: { id: chargeId },
        data: { status},
      });
      if(!update) {
        throw new ConflictException('Erro ao atualizar o status do pagamento CREDIT_CARD.');
      } else {
        return {
          statusCode: 200,
          message: 'Status do pagamento CREDIT_CARD atualizado com sucesso.',
          charge: update
        }
      };
    };
  };
};


