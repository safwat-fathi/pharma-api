const CONSTANTS = {
  ACCESS_TOKEN: 'access_token',
  SESSION: {
    // EXPIRATION_TIME: 1000 * 60 * 60 * 24, // 1 day
    EXPIRATION_TIME: 10 * 60 * 1000, // 10 minutes
    REFRESH_TOKEN_EXPIRATION_TIME: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
  MESSAGE: {
    SUCCESS: 'Success',
    FAILED: 'Failed',
  },
  USER_MESSAGE: {
    TEXT_REGISTER_PHARMACY: 'register pharmacy',
    TEXT_REGISTER_CUSTOMER: 'register customer',
    TEXT_SKIP: 'skip',
    TEXT_CLEAR: 'clear',
    TEXT_RESET: 'reset',
  },
  NEARBY_PHARMACY_RADIUS: 2, // in km
  APP_MESSAGE: {
    INITIAL_MESSAGE: `Welcome to Pharma Delivery! To place an order, please send a picture of your prescription. To register as a pharmacy, send "register pharmacy".`,
  },
  ROLE: {
    ADMIN: 'admin',
    OWNER: 'owner',
    CUSTOMER: 'customer',
  },
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },
  DEFAULT: {
    LIMIT: 10,
    OFFSET: 0,
  },
  DATE_FORMAT: 'YYYY-MM-DD',
  DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_ZONE_FORMAT: 'YYYY-MM-DD HH:mm:ss Z',
};

export default CONSTANTS;
