import 'dotenv/config';
import type { CookieOptions } from 'express';

const HOST_ENV = process.env.HOST;
export const IS_DEV =
  HOST_ENV === 'localhost' ? true : process.env.NODE_ENV === 'development'; // for testing production containers on localhost
export const IS_PROD = !IS_DEV;
export const SERVER_PORT = Number(process.env.SERVER_PORT);
export const CLIENT_PORT = Number(process.env.CLIENT_PORT);

export const HOST = IS_PROD ? HOST_ENV : 'localhost';
export const API_HOST = `api.${HOST}`;
export const IS_HTTPS = IS_PROD;
export const PROTOCOL = IS_HTTPS ? 'https' : 'http';
export const URL = `${PROTOCOL}://${HOST}`;
export const APP_URL = `${URL}${IS_PROD ? '' : `:${CLIENT_PORT}`}`;
export const API_PREFIX = '/api';

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: 'strict',
  domain: `.${HOST}`,
};
