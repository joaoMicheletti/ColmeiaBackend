import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ChargesModule } from './modules/charges/charges.module';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';

@Module({
  imports: [PrismaModule, CustomersModule, ChargesModule],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
