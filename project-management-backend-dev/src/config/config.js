import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('Mongo db connection string is not provided.');
}

if (!process.env.MAIL_SENDER) {
  throw new Error('Sender mail id is not provided');
}

if (!process.env.APP_PASSWORD) {
  throw new Error('App password is not provided');
}

export const config = {
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_KEY: process.env.JWT_SECRET_ACCESS_KEY || 'secret access key',
  JWT_ACCESS_EXPIRATION: process.env.JWT_SECRET_ACCESS_EXPIRATION || '5m',
  JWT_REFRESH_KEY: process.env.JWT_SECRET_REFRESH_KEY || 'secret refresh key',
  JWT_REFRESH_EXPIRATION: process.env.JWT_SECRET_REFRESH_EXPIRATION || '30d',
  INVITE_USER_TOKEN_EXPIRATION_TIME:
    process.env.INVITE_USER_TOKEN_EXPIRATION_TIME || '1d',
  INVITE_USER_TOKEN_KEY: process.env.INVITE_USER_TOKEN_KEY,
  MAIL_SENDER: process.env.MAIL_SENDER,
  APP_PASSWORD: process.env.APP_PASSWORD,
  OTP_EXPIRATION: process.env.OTP_EXPIRATION || 5,
  PUBLIC_KEY:process.env.PUBLIC_KEY,
  PRIVATE_KEY:process.env.PRIVATE_KEY
};
