export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  LOCATION = 'location',
  DOCUMENT = 'document',
}

export type DocumentMessage = {
  type: MessageType.DOCUMENT;
  document: {
    mime_type: string;
    sha256: string;
    id: string;
  };
};

export type LocationMessage = {
  type: MessageType.LOCATION;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    name: string;
  };
};

export type ImageMessage = {
  type: MessageType.IMAGE;
  image: {
    mime_type: string;
    sha256: string;
    id: string;
  };
};

export type TextMessage = {
  type: MessageType.TEXT;
  text: {
    body: string;
  };
};

export type Base = {
  from: string;
  id: string;
  timestamp: string;
};

export type Message = Base &
  (TextMessage | ImageMessage | LocationMessage | DocumentMessage);

export type MessagePayload = {
  entry: {
    changes: {
      value: {
        messages: Message[];
      };
    }[];
  }[];
};
