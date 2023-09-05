import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
// import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  mockInvalidEditUserDto,
  mockSignUpDto,
  mockSignUpDtoInvalidEmail,
  mockSignUpDtoInvalidName,
  mockSignUpDtoInvalidPassword,
  mockTrainingSettingsDto,
  mockUpdatedUserDto,
} from './mockData';
import supertest from 'supertest';
import { UserDto } from '../src/user/dto';
import { JwtService } from '@nestjs/jwt';
import { UserWithTrainingSettings } from 'user';
import { Tokens } from '../src/auth/types';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let requestAgent: supertest.SuperTest<supertest.Test>;
  let unAuthedRequestAgent: supertest.SuperTest<supertest.Test>;
  let currentTokensWithCookies: Tokens & { cookiesString: string };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    requestAgent = supertest.agent(app.getHttpServer());
    jwtService = app.get(JwtService);
    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();
    // pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  beforeEach(() => {
    unAuthedRequestAgent = supertest.agent(app.getHttpServer());
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should throw if no body provided', () => {
        return unAuthedRequestAgent.post('/auth/signup').expect(400);
      });

      it('should throw if password empty', () => {
        return unAuthedRequestAgent
          .post('/auth/signup')
          .send({
            email: mockSignUpDto.email,
          })
          .expect(400);
      });

      it('should throw if email is invalid', () => {
        return unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDtoInvalidEmail)
          .expect(400);
      });

      it('should throw if name is invalid', () => {
        return unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDtoInvalidName)
          .expect(400);
      });

      it('should throw if password is invalid', () => {
        return unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDtoInvalidPassword)
          .expect(400);
      });

      it('should signup', () => {
        return unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDto)
          .expect(201)
          .expect((res) => {
            verifyAuthResponse(res, jwtService);
          });
      });
    });

    describe('Signin', () => {
      it('should throw if no body provided', () => {
        return unAuthedRequestAgent.post('/auth/signin').expect(400);
      });

      it('should throw if email empty', () => {
        return unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            password: mockSignUpDto.password,
          })
          .expect(400);
      });

      it('should throw if password empty', () => {
        return unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            email: mockSignUpDto.email,
          })
          .expect(400);
      });

      it('should throw if email is not valid', () => {
        return unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            ...mockSignUpDtoInvalidEmail,
          })
          .expect(400);
      });

      it('should throw if password length is less than 8', () => {
        return unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            ...mockSignUpDtoInvalidPassword,
          })
          .expect(400);
      });

      it('should throw if password does not contain a number', () => {
        return unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            email: mockSignUpDto.email,
            password: 'PasswordWithoutNumber',
          })
          .expect(400);
      });

      it('should not get current user from /user without cookies', async () => {
        await unAuthedRequestAgent.get('/user').expect(401);
      });

      it('should signin', async () => {
        await requestAgent
          .post('/auth/signin')
          .send(mockSignUpDto)
          .expect(200)
          .expect((res) => {
            verifyAuthResponse(res, jwtService);
            // Extract cookies from the response
            currentTokensWithCookies = extractTokensFromCookies(
              res.headers['set-cookie'],
            );
          });
      });

      it('should get current user from /user', async () => {
        await requestAgent
          .get('/user')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email', mockSignUpDto.email);
            expect(res.body).toHaveProperty('name', mockSignUpDto.name);
            expect(res.body).toHaveProperty('trainingSettings');
          });
      });

      it('should not update user with invalid data', async () => {
        await requestAgent
          .patch('/user')
          .send(mockInvalidEditUserDto)
          .expect(400)
          .expect((res) => {
            const { message } = res.body;
            //there should be a lot of validation errors inside message
            expect(message.length).toBeGreaterThanOrEqual(
              Object.keys(mockInvalidEditUserDto).length +
                Object.keys(mockInvalidEditUserDto.trainingSettings).length,
            );
          });
      });

      it('should update user', async () => {
        await requestAgent
          .patch('/user')
          .send(mockUpdatedUserDto)
          .expect(200)
          .expect((res) => {
            expect(res.headers['set-cookie']).toBeTruthy();
            const newTokensWithCookies = extractTokensFromCookies(
              res.headers['set-cookie'],
            );
            //new auth token comparing with old one
            expect(newTokensWithCookies.accessToken).not.toEqual(
              currentTokensWithCookies.accessToken,
            );
            currentTokensWithCookies = newTokensWithCookies;
            //check for updated user
            const updatedUser: UserWithTrainingSettings = res.body;
            expect(updatedUser.email).toBe(mockUpdatedUserDto.email);
            expect(updatedUser.name).toBe(mockUpdatedUserDto.name);
            expect(updatedUser.trainingSettings).toBeDefined();
            expect(updatedUser.trainingSettings).toEqual(
              expect.objectContaining(mockTrainingSettingsDto),
            );
          });
      });

      it('should not refresh tokens in cookies without valid cookies', async () => {
        return unAuthedRequestAgent.get('/auth/refresh').expect(401);
      });

      it('should refresh tokens', async () => {
        // wait for 1 second to make sure we get a new token
        await new Promise((resolve, _) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        });

        await requestAgent
          .get('/auth/refresh')
          .expect(200)
          .expect((res) => {
            const newTokensWithCookies = extractTokensFromCookies(
              res.headers['set-cookie'],
            );
            expect(newTokensWithCookies).not.toEqual(currentTokensWithCookies);
            currentTokensWithCookies = newTokensWithCookies;
          });
      });
      it('should logout user successfully', async () => {
        await requestAgent
          .post('/auth/logout')
          .expect(200)
          .expect((res) => {
            // Check if cookies were cleared
            const cookies = res.headers['set-cookie'];
            expect(
              cookies.some((cookie) => cookie.includes('access_token=;')),
            ).toBeTruthy();
            expect(
              cookies.some((cookie) => cookie.includes('refresh_token=;')),
            ).toBeTruthy();
          });
      });
    });
  });
});

function verifyAuthResponse(
  { body, headers }: { body: Partial<UserDto>; headers: any },
  jwtService: JwtService,
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
    cookies.some((cookie: string) => cookie.startsWith('access_token=')),
  ).toBe(true);

  expect(
    cookies.some((cookie: string) => cookie.startsWith('refresh_token=')),
  ).toBe(true);

  // Check for httpOnly flag
  expect(cookies.some((cookie: string) => cookie.includes('HttpOnly'))).toBe(
    true,
  );

  // Decode JWT token and verify
  const accessTokenCookie = cookies.find((cookie: string) =>
    cookie.startsWith('access_token='),
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

function extractTokensFromCookies(
  cookies: string[],
): Tokens & { cookiesString: string } {
  expect(cookies).toBeTruthy();
  const accessTokenCookie = cookies.find((cookie: string) =>
    cookie.startsWith('access_token='),
  );

  const refreshTokenCookie = cookies.find((cookie: string) =>
    cookie.startsWith('refresh_token='),
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
