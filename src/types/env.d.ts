declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      APP_URL: string;
      PORT: number;
      MONGO_URI: string;
      META_PHONE_NUMBER_ID: string;
      META_ACCESS_TOKEN: string;
      META_GRAPH_API_BASE: string;
      META_WEBHOOK_VERIFY_TOKEN: string;
      META_CALLBACK_URL: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASS: string;
      SESSION_SECRET: string;
    }
  }
}

export {};
