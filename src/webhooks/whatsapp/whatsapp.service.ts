import { Injectable } from '@nestjs/common';
import { SessionsService } from 'src/sessions/sessions.service';
// Import other services: OrdersService, PharmaciesService, CustomersService, TwilioService

@Injectable()
export class WhatsappService {
  constructor(
    private readonly sessionsService: SessionsService,
    // private readonly ordersService: OrdersService,
    // ... inject other services
  ) {}

  async routeMessage(
    from: string,
    body?: string,
    imageOrDocument?: string,
    location?: any,
  ) {
    const session = await this.sessionsService.getSession(from);

    // Example routing logic
    if (!session) {
      // New user or new interaction
      if (imageOrDocument) {
        // Potential new order with a prescription image
        // Call OrdersService to handle new order flow
        console.log('Starting new order flow...');
      } else if (body && body.toLowerCase().startsWith('register')) {
        // Start pharmacy registration flow
        console.log('Starting pharmacy registration...');
      } else {
        // Send a welcome message
        console.log('Sending welcome message...');
      }
    } else {
      // User is in an active session/flow
      switch (session.flow) {
        case 'AWAITING_QUOTE_RESPONSE':
          // This is a pharmacy replying with a quote
          // Call OrdersService to parse and save the quote
          break;
        case 'AWAITING_QUOTE_SELECTION':
          // This is a customer choosing a quote
          // Call OrdersService to confirm the order
          break;
        // Add more cases for each step of your flows
      }
    }
  }
}
