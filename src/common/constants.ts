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
