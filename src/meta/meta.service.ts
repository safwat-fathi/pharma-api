import { Injectable } from '@nestjs/common';


@Injectable()
export class MetaService {
  private readonly accessToken = process.env.META_ACCESS_TOKEN;
  private readonly fromPhoneNumberId = process.env.META_PHONE_NUMBER_ID;
  private readonly graphApiUrl = `${process.env.META_GRAPH_API_BASE}/${this.fromPhoneNumberId}/messages`;

  constructor() {}

  async sendMessage(to: string, text: string) {
    try {
      const response = await fetch(this.graphApiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        // The request body must be a string, so we use JSON.stringify()
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: text },
        }),
      });

      // fetch doesn't throw an error on bad HTTP status, so we check it manually
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.status} ${JSON.stringify(errorData)}`,
        );
      }
    } catch (error) {
      console.error('Error sending Meta message:', error.message);
    }
  }
}
