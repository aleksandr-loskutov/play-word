import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';
import { Tokens } from '../src/auth/types';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'aleksandr@fakemail.com',
      password: '12345',
    };
    let tokens: Tokens;
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/local/signup').expectStatus(400);
      });
      it('should signup', () => {
        return request(app.getHttpServer())
          .post('/auth/local/signup')
          .send(dto)
          .expect(201)
          .expect(({ body }: { body: Tokens }) => {
            expect(body.access_token).toBeTruthy();
            expect(body.refresh_token).toBeTruthy();
          });
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/local/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/local/signin').expectStatus(400);
      });
      it('should signin', () => {
        return request(app.getHttpServer())
          .post('/auth/local/signin')
          .send(dto)
          .expect(200)
          .expect(({ body }: { body: Tokens }) => {
            expect(body.access_token).toBeTruthy();
            expect(body.refresh_token).toBeTruthy();

            tokens = body;
          });
      });
      it('should get current user from /users/me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer ${tokens.access_token}`,
          })
          .expectStatus(200);
      });
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Aleksandr',
          lastName: 'L',
          email: 'aleksandrL@fakemail.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer ${tokens.access_token}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .expectBodyContains(dto.email);
      });
      it('should refresh tokens', async () => {
        // wait for 1 second
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(true);
          }, 1000);
        });
        return request(app.getHttpServer())
          .post('/auth/refresh')
          .auth(tokens.refresh_token, {
            type: 'bearer',
          })
          .expect(200)
          .expect(({ body }: { body: Tokens }) => {
            expect(body.access_token).toBeTruthy();
            expect(body.refresh_token).toBeTruthy();
            expect(body.refresh_token).not.toBe(tokens.access_token);
            expect(body.refresh_token).not.toBe(tokens.refresh_token);
            tokens = body;
          });
      });
      it('should logout', () => {
        return request(app.getHttpServer())
          .post('/auth/logout')
          .auth(tokens.access_token, {
            type: 'bearer',
          })
          .expect(200);
      });
    });
  });
});
