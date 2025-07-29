import { Injectable } from '@nestjs/common';
import { saveMediaToServer } from 'src/common/utils/media.util';

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
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: text },
        }),
      });

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

  /**
   * Downloads a media file from WhatsApp and saves it locally.
   * @param mediaId The ID of the media from the webhook payload.
   * @returns The local path where the file was saved.
   */
  async downloadMediaFile(mediaId: string): Promise<string> {
    try {
      // Step 1: Get the media object which contains the temporary download URL
      const urlResponse = await fetch(
        `https://graph.facebook.com/v19.0/${mediaId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      );

      if (!urlResponse.ok) {
        const errorData = await urlResponse.json();
        console.error('Meta API error (getting URL):', errorData);
        throw new Error('Failed to get media URL from Meta');
      }

      const { url, mime_type } = await urlResponse.json();
      if (!url) {
        throw new Error('Media URL not found in Meta API response');
      }

      // Step 2: Download the actual image file using the temporary URL
      const imageResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!imageResponse.ok) {
        const errorData = await imageResponse.text();
        console.error('Download error:', errorData);
        throw new Error('Failed to download image file');
      }

      const buffer = await imageResponse.arrayBuffer();

      // Step 3: Save the file using the utility function
      const localPath = await saveMediaToServer(Buffer.from(buffer), mime_type);

      return localPath;
    } catch (error) {
      console.error('Error in downloadMediaFile:', error.message);
      throw error;
    }
  }
}
