import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { WhatsappService } from './whatsapp.service';
import { MessagePayload } from 'src/common/interfaces/message.interface';

@Controller('webhooks/whatsapp')
export class WhatsappController {
  private readonly verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;

  constructor(private readonly whatsappService: WhatsappService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') token: string,
    @Res() res: Response,
  ) {
    if (mode === 'subscribe' && token === this.verifyToken) {
      console.log('Webhook verified successfully!');
      res.status(HttpStatus.OK).send(challenge);
    } else {
      console.error(
        'Failed webhook verification. Make sure the verify tokens match.',
      );
      res.sendStatus(HttpStatus.FORBIDDEN);
    }
  }

  @Post()
  async handleIncomingMessage(
    @Body() payload: MessagePayload,
    @Res() res: Response,
  ) {
    // 1. Acknowledge the request immediately to prevent Meta from resending.
    res.sendStatus(HttpStatus.OK);

    try {
      // 2. Extract the message object from the payload.
      const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      // 3. If a message exists, pass it to the service for processing.
      //    If it's a status update or other event, we simply ignore it.
      if (message) {
        await this.whatsappService.handleIncomingMessage(message);
      }
    } catch (error) {
      // Log any errors that occur during the initial handoff.
      console.error('Error in webhook controller:', error);
    }
  }
}
