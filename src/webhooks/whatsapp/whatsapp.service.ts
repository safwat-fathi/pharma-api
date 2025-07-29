import { Injectable } from '@nestjs/common';
import { SessionsService } from 'src/sessions/sessions.service';
import { OrdersService } from 'src/orders/orders.service';
import { CustomersService } from 'src/customers/customers.service';
import { MetaService } from 'src/meta/meta.service';
import { Message, MessageType } from 'src/common/interfaces/message.interface';
import { SessionFlow } from 'src/common/enums/session-flow.enum';
import { SessionData } from 'express-session';
import { PharmaciesService } from 'src/pharmacies/pharmacies.service';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly ordersService: OrdersService,
    private readonly customersService: CustomersService,
    private readonly metaService: MetaService,
    private readonly pharmaciesService: PharmaciesService,
  ) {}

  public async handleIncomingMessage(message: Message): Promise<void> {
    const from = message.from;
    const session = await this.sessionsService.getSession(from);

    if (session) {
      await this.handleSessionBasedMessage(from, message, session);
    } else {
      await this.handleNewInteraction(from, message);
    }
  }

  private async handleSessionBasedMessage(
    from: string,
    message: Message,
    session: SessionData,
  ): Promise<void> {
    console.log(`User ${from} is in an active session: ${session.flow}`);

    if (
      message.type === MessageType.TEXT &&
      (message.text.body.toLowerCase() === 'clear' ||
        message.text.body.toLowerCase() === 'reset')
    ) {
      await this.sessionsService.clearSession(from);
      await this.metaService.sendMessage(
        from,
        'Your session has been cleared. You can start a new order by sending a prescription.',
      );
      return;
    }

    switch (session.flow) {
      case SessionFlow.AWAITING_LOCATION:
        if (message.type === MessageType.LOCATION && session.data?.customerId) {
          // Update customer with location
          await this.customersService.updateLocation(
            session.data.customerId,
            message.location,
          );
          // TODO: Trigger pharmacy geo-query and quote broadcast
          await this.metaService.sendMessage(
            from,
            'Thank you! We are now finding nearby pharmacies to fulfill your order.',
          );
          await this.sessionsService.clearSession(from);
        } else {
          await this.metaService.sendMessage(
            from,
            'Please share your location to proceed with the order.',
          );
        }
        break;

      case SessionFlow.PHARMACY_REGISTRATION:
        if (message.type === MessageType.TEXT) {
          await this.sessionsService.setSession(from, {
            flow: SessionFlow.AWAITING_PHARMACY_LOCATION,
            pharmacyName: message.text.body,
          });
          await this.metaService.sendMessage(
            from,
            'Thank you. Now, please share your pharmacy location.',
          );
        } else {
          await this.metaService.sendMessage(
            from,
            'Please provide your pharmacy name.',
          );
        }
        break;

      case SessionFlow.AWAITING_PHARMACY_LOCATION:
        if (
          message.type === MessageType.LOCATION &&
          session.data?.pharmacyName
        ) {
          const { latitude, longitude, address } = message.location;
          await this.pharmaciesService.create(
            session.data.pharmacyName,
            from,
            {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            address,
          );
          await this.metaService.sendMessage(
            from,
            'Your pharmacy has been registered successfully!',
          );
          await this.sessionsService.clearSession(from);
        } else {
          await this.metaService.sendMessage(
            from,
            'Please share your location to complete the registration.',
          );
        }
        break;

      // ... other session cases
      default:
        await this.sessionsService.clearSession(from);
        await this.metaService.sendMessage(
          from,
          "Our conversation flow had an issue. Let's start over.",
        );
        break;
    }
  }

  private async handleNewInteraction(
    from: string,
    message: Message,
  ): Promise<void> {
    // Find or create customer
    let customer = await this.customersService.findByWhatsappNumber(from);
    console.log(
      '🚀 ~ :145 ~ WhatsappService ~ handleNewInteraction ~ customer:',
      customer?._id,
    );
    if (!customer) {
      customer = await this.customersService.create(
        from,
        message.from || 'New User',
      );
    }

    // Route based on message type
    switch (message.type) {
      case MessageType.IMAGE:
      case MessageType.DOCUMENT:
        const mediaId =
          message.type === MessageType.IMAGE
            ? message.image.id
            : message.document.id;
        try {
          const localPath = await this.metaService.downloadMediaFile(mediaId);
          const order = await this.ordersService.createOrder(
            customer,
            localPath,
          );

          // Set session to await location
          await this.sessionsService.setSession(from, {
            flow: SessionFlow.AWAITING_LOCATION,
            data: {
              orderId: order.id,
              customerId: customer._id,
            },
          });

          await this.metaService.sendMessage(
            from,
            'Thank you for your prescription. Please share your location so we can find pharmacies near you.',
          );
        } catch (error) {
          console.error('Failed to process new prescription order:', error);
          await this.metaService.sendMessage(
            from,
            'Sorry, we had trouble processing your prescription. Please try again.',
          );
        }
        break;

      case MessageType.TEXT:
        const text = message.text.body.toLowerCase();
        if (text === 'register pharmacy') {
          await this.sessionsService.setSession(from, {
            flow: SessionFlow.PHARMACY_REGISTRATION,
          });
          await this.metaService.sendMessage(
            from,
            'Welcome to pharmacy registration. Please tell us your pharmacy name.',
          );
        } else if (text === 'register customer') {
          await this.sessionsService.setSession(from, {
            flow: SessionFlow.CUSTOMER_REGISTRATION,
          });
          await this.metaService.sendMessage(
            from,
            'Welcome. Please tell us your full name to register.',
          );
        } else {
          // Handle text from new users (e.g., pharmacy registration)
          await this.metaService.sendMessage(
            from,
            'Welcome to Pharma Delivery! To place an order, please send a picture of your prescription. To register as a pharmacy, send "register pharmacy".',
          );
        }
        break;

      default:
        await this.metaService.sendMessage(
          from,
          'To start an order, please send an image of your prescription.',
        );
        break;
    }
  }
}
