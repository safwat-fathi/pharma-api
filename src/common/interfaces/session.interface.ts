import { SessionFlow } from '../enums/session-flow.enum';

export interface CustomSessionData {
  flow: SessionFlow;
  data?: {
    customerId?: string;
    orderId?: string;
    pharmacyName?: string;
  };
}
