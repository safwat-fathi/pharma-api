import {
  Controller,
  Post,

  Body,

  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { MetaService } from 'src/meta/meta.service';
import { WhatsappService } from './whatsapp.service';
import { MessagePayload, MessageType } from 'src/common/interfaces/message.interface';

@Controller('webhooks/whatsapp')
export class WhatsappController {
  constructor(private metaService: MetaService, private whatsappService: WhatsappService) {}

  // ... (Your GET method for verification remains the same) ...

  @Post()
  async handleIncomingMessage(@Body() payload: MessagePayload, @Res() res: Response) {
    // Acknowledge the request immediately
    res.sendStatus(HttpStatus.OK);

    try {
			// 1. Extract the message object from the payload
      const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
			if (message) {
        console.log(
          '🚀 ~ :30 ~ WhatsappController ~ handleIncomingMessage ~ message:',
          message,
        );
        const from = message.from;

        switch (message.type) {
          case MessageType.LOCATION:
            console.log(
              `Received location from ${from}: "${message.location}"`,
            );
            await this.whatsappService.routeMessage(
              from,
              undefined,
              undefined,
              message.location,
            );

            break;
          case MessageType.IMAGE:
            console.log(`Received image from ${from}: "${message.image}"`);
            await this.whatsappService.routeMessage(
              from,
              undefined,
              message.image.id,
              undefined,
            );

            break;
          case MessageType.DOCUMENT:
            console.log(
              `Received document from ${from}: "${message.document}"`,
            );

            await this.whatsappService.routeMessage(
              from,
              undefined,
              message.document.id,
              undefined,
            );

            break;
          case MessageType.TEXT:
            const body = message.text.body;
            console.log(`Received message from ${from}: "${body}"`);

            const replyText = `You said: "${body}". We got your message!`;
            await this.metaService.sendMessage('+201143341684', replyText);

            await this.whatsappService.routeMessage(from, body);

            break;
          default:
            console.log(`Received unknown message type: "${message}"`);

            break;
        }
      }      
    } catch (error) {
      console.error('Error processing incoming message:', error);
    }
  }
}
