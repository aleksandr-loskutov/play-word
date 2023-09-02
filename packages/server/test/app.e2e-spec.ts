import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import {
  mockSignUpDto,
  mockSignUpDtoInvalidEmail,
  mockSignUpDtoInvalidName,
  mockSignUpDtoInvalidPassword,
} from './mockData';
import supertest from 'supertest';
import { UserDto } from '../src/user/dto';
import { JwtService } from '@nestjs/jwt';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let requestAgent: supertest.SuperTest<supertest.Test>;
  let cookies: string;

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
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    describe('Signup', () => {
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: mockSignUpDto.email,
          })
          .expectStatus(400);
      });

      it('should throw if email is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(mockSignUpDtoInvalidEmail)
          .expectStatus(400);
      });

      it('should throw if name is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(mockSignUpDtoInvalidName)
          .expectStatus(400);
      });

      it('should throw if password is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(mockSignUpDtoInvalidPassword)
          .expectStatus(400);
      });

      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup', () => {
        return requestAgent
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
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: mockSignUpDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: mockSignUpDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if email is not valid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            ...mockSignUpDtoInvalidEmail,
          })
          .expectStatus(400);
      });

      it('should throw if password length is less than 8', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            ...mockSignUpDtoInvalidPassword,
          })
          .expectStatus(400);
      });

      it('should throw if password does not contain a number', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: mockSignUpDto.email,
            password: 'PasswordWithoutNumber',
          })
          .expectStatus(400);
      });

      it('should signin', async () => {
        await requestAgent
          .post('/auth/signin')
          .send(mockSignUpDto)
          .expect(200)
          .expect((res) => {
            verifyAuthResponse(res, jwtService);
            // Extract cookies from the response
            if (Array.isArray(res.headers['set-cookie'])) {
              cookies = res.headers['set-cookie']
                .map((cookie) => cookie.split(';')[0])
                .join('; ');
            }
          });
      });

      it('should get current user from /user', async () => {
        await requestAgent
          .get('/user')
          .set('Cookie', cookies)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('email', mockSignUpDto.email);
            expect(res.body).toHaveProperty('name', mockSignUpDto.name);
            expect(res.body).toHaveProperty('trainingSettings');
          });
      });
    });
  });
});

function verifyAuthResponse(
  { body, headers }: { body: UserDto; headers: any },
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

  // Optional: Check for httpOnly flag
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
