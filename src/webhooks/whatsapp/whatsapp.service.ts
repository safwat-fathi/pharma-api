import { Injectable } from '@nestjs/common';
import { SessionsService } from 'src/sessions/sessions.service';
import { OrdersService } from 'src/orders/orders.service';
import { CustomersService } from 'src/customers/customers.service';
import { MetaService } from 'src/meta/meta.service';
import { Message, MessageType } from 'src/common/interfaces/message.interface';
import { SessionFlow } from 'src/common/enums/session-flow.enum';
import { SessionData } from 'express-session';
import { PharmaciesService } from 'src/pharmacies/pharmacies.service';
import { Customer } from 'src/customers/schemas/customer.schema';
import mongoose, { type ObjectId } from 'mongoose';
import CONSTANTS from 'src/common/constants';

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
    console.log(
      '🚀 ~ :24 ~ WhatsappService ~ handleIncomingMessage ~ session:',
      session,
    );

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
    // Clear session if user sends clear or reset
    if (
      message.type === MessageType.TEXT &&
      (message.text.body.toLowerCase() === CONSTANTS.USER_MESSAGE.TEXT_CLEAR ||
        message.text.body.toLowerCase() === CONSTANTS.USER_MESSAGE.TEXT_RESET)
    ) {
      await this.endSession(from);
      return;
    }

    switch (session.flow) {
      case SessionFlow.AWAITING_LOCATION:
        if (message.type === MessageType.LOCATION && session.data?.customerId) {
          console.log(
            '🚀 ~ :59 ~ WhatsappService ~ handleSessionBasedMessage ~ message:',
            message,
          );
          // Update customer with location
          await this.customersService.updateLocation(
            session.data.customerId,
            message.location,
          );
          // TODO: Can check if customer has location first before sending message if he does have location we then trigger pharmacy geo-query and quote broadcast immediately if he doesn't then we wait for location

          const [longitude, latitude] = [
            message.location.longitude,
            message.location.latitude,
          ];
          const pharmaciesNearby = await this.pharmaciesService.findNearby(
            [longitude, latitude],
            CONSTANTS.NEARBY_PHARMACY_RADIUS,
          );
          console.log(
            '🚀 ~ :77 ~ WhatsappService ~ handleSessionBasedMessage ~ pharmaciesNearby:',
            pharmaciesNearby.length,
          );
          for (const pharmacy of pharmaciesNearby) {
            console.log(
              '🚀 ~ :79 ~ WhatsappService ~ handleSessionBasedMessage ~ pharmacy:',
              pharmacy.location,
            );
          }

          await this.metaService.sendMessage(
            from,
            'Thank you! We are now finding nearby pharmacies to fulfill your order.',
          );

          // await this.handleCustomerLocation(
          //   from,
          //   message.location,
          //   session.data.customerId,
          // );
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
        await this.handleNewCustomer(from, mediaId, customer);
        break;

      case MessageType.TEXT:
        const text = message.text.body.toLowerCase();
        if (text === CONSTANTS.USER_MESSAGE.TEXT_REGISTER_PHARMACY) {
          await this.handleRegisterPharmacy(from);
        } else if (text === CONSTANTS.USER_MESSAGE.TEXT_REGISTER_CUSTOMER) {
          await this.handleRegisterCustomer(from);
        } else if (text === CONSTANTS.USER_MESSAGE.TEXT_SKIP) {
          await this.handleSkipCustomerName(from);
        } else {
          // Handle text from new users (e.g., pharmacy registration)
          await this.metaService.sendMessage(
            from,
            CONSTANTS.APP_MESSAGE.INITIAL_MESSAGE,
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

  async handleNewCustomer(
    from: string,
    mediaId: string,
    customer: Customer,
  ): Promise<void> {
    try {
      const localPath = await this.metaService.downloadMediaFile(mediaId);
      const order = await this.ordersService.createOrder(customer, localPath);

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
  }

  async handleRegisterPharmacy(from: string): Promise<void> {
    await this.sessionsService.setSession(from, {
      flow: SessionFlow.PHARMACY_REGISTRATION,
    });

    await this.metaService.sendMessage(
      from,
      'Welcome to pharmacy registration. We will need your pharmacy name, address, and location. Please tell us your pharmacy name.',
    );
  }

  async handleRegisterCustomer(from: string): Promise<void> {
    await this.sessionsService.setSession(from, {
      flow: SessionFlow.CUSTOMER_REGISTRATION,
    });

    await this.metaService.sendMessage(
      from,
      'Welcome to customer registration. We will need your name (optional), address, and location. Please tell us your name or to skip type "skip".',
    );
  }

  async handleSkipCustomerName(from: string): Promise<void> {
    await this.metaService.sendMessage(from, 'Kindly provide your address.');
  }

  async handleCustomerAddress(
    from: string,
    address: string,
    customerId: ObjectId,
  ): Promise<void> {
    await this.customersService.updateAddress(customerId, address);

    await this.metaService.sendMessage(
      from,
      'Your location has been updated successfully!',
    );
  }

  async handleCustomerLocation(
    from: string,
    location: { latitude: number; longitude: number },
    customerId: string,
  ): Promise<void> {
    await this.customersService.updateLocation(customerId, location);

    await this.metaService.sendMessage(
      from,
      'Your location has been updated successfully!',
    );

    // TODO: Trigger pharmacy geo-query and quote broadcast
  }

  async endSession(from: string): Promise<void> {
    await this.sessionsService.clearSession(from);
    await this.metaService.sendMessage(
      from,
      'Your session has been cleared. You can start a new order by sending a prescription.',
    );
  }
}
