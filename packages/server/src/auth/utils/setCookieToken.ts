import { Response } from 'express';
import { Tokens } from '../types';

export default function setCookieToken(response: Response, tokens: Tokens) {
  // TODO включить domain wildcard и secure для production
  response.cookie('access_token', tokens.accessToken, {
    httpOnly: true,
  });
  response.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
  });
  return response;
}
