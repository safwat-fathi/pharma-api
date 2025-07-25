import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { MetaService } from 'src/meta/meta.service';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, SessionsService, MetaService],
})
export class WhatsappModule {}
