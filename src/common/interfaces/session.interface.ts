import { SessionFlow } from '../enums/session-flow.enum';

export interface CustomSessionData {
  flow: SessionFlow;
  data?: {
    customerId?: string;
    orderId?: string;
    pharmacyName?: string;
    // Add any other data you need to track
    [key: string]: any;
  };
}
