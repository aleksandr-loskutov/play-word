import type { Response } from 'express';
import type { Tokens } from '../types';
import { COOKIE_OPTIONS } from '../../common/consts';

export default function setCookieToken(response: Response, tokens: Tokens) {
  response.cookie('access_token', tokens.accessToken, COOKIE_OPTIONS);
  response.cookie('refresh_token', tokens.refreshToken, COOKIE_OPTIONS);
  return response;
}
