export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    url: process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    password: process.env.SWAGGER_PASSWORD || 'admin123',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  timezone: process.env.TZ || 'America/Argentina/Buenos_Aires',
});

