import type { JwtService } from '@nestjs/jwt';
import type { UserDto } from '../../src/user/dto';
import { mockSignUpDto } from '../mockData';
import type { Tokens } from '../../src/auth/types';

export function verifyAuthResponse(
  { body, headers }: { body: Partial<UserDto>; headers: any },
  jwtService: JwtService
) {
  expect(typeof body.id).toBe('number');
  expect(body.email).toBe(mockSignUpDto.email);
  expect(body.name).toBe(mockSignUpDto.name);
  expect(typeof body.createdAt).toBe('string');
  expect(body.trainingSettings).toBeDefined();

  // Verify cookies
  const cookies = headers['set-cookie'];
  expect(cookies).toBeDefined();

  expect(
    cookies.some((cookie: string) => cookie.startsWith('access_token='))
  ).toBe(true);

  expect(
    cookies.some((cookie: string) => cookie.startsWith('refresh_token='))
  ).toBe(true);

  // Check for httpOnly flag
  expect(cookies.some((cookie: string) => cookie.includes('HttpOnly'))).toBe(
    true
  );

  // Decode JWT token and verify
  const accessTokenCookie = cookies.find((cookie: string) =>
    cookie.startsWith('access_token=')
  );
  const accessToken = accessTokenCookie.split(';')[0].split('=')[1];
  const decodedToken: any = jwtService.decode(accessToken);

  if (typeof decodedToken === 'object') {
    expect(decodedToken.id).toBe(body.id);
    expect(decodedToken.email).toBe(mockSignUpDto.email);
    expect(decodedToken.name).toBe(mockSignUpDto.name);
    expect(decodedToken.trainingSettings).toBeDefined();
  } else {
    throw new Error('JWT did not decode to an object');
  }
}

export function extractTokensFromCookies(
  cookies: string[]
): Tokens & { cookiesString: string } {
  expect(cookies).toBeTruthy();
  const accessTokenCookie = cookies.find((cookie: string) =>
    cookie.startsWith('access_token=')
  );

  const refreshTokenCookie = cookies.find((cookie: string) =>
    cookie.startsWith('refresh_token=')
  );
  const accessToken = accessTokenCookie.split(';')[0].split('=')[1];
  const refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];

  expect(accessToken).toBeTruthy();
  expect(refreshToken).toBeTruthy();

  const cookiesString = cookies
    .map((cookie) => cookie.split(';')[0])
    .join('; ');

  return { accessToken, refreshToken, cookiesString };
}
