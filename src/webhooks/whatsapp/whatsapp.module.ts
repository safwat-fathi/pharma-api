import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { MetaService } from 'src/meta/meta.service';
import { CustomersModule } from 'src/customers/customers.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PharmaciesModule } from 'src/pharmacies/pharmacies.module';

@Module({
  imports: [CustomersModule, OrdersModule, PharmaciesModule],
  controllers: [WhatsappController],
  providers: [WhatsappService, SessionsService, MetaService],
})
export class WhatsappModule {}
