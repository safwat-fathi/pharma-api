import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { OrdersModule } from './orders/orders.module';
import { MetaModule } from './meta/meta.module';
import { SessionsModule } from './sessions/sessions.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { redisConfig } from './config/redis.config';
import { WhatsappModule } from './webhooks/whatsapp/whatsapp.module';
import { URI } from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(URI),
    RedisModule.forRoot({
      config: redisConfig,
    }),
    CustomersModule,
    PharmaciesModule,
    OrdersModule,
    MetaModule,
    SessionsModule,
    WhatsappModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
