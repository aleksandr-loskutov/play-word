import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import supertest from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { UserWithTrainingSettings } from 'user';
import AppModule from '../src/app.module';
import PrismaService from '../src/prisma/prisma.service';
import {
  mockInvalidEditUserDto,
  mockRequestCollectionCreateDto,
  mockInvalidRequestCollectionUpdateDto,
  mockSignUpDto,
  mockSignUpDtoInvalidEmail,
  mockSignUpDtoInvalidName,
  mockSignUpDtoInvalidPassword,
  mockSignUpSecondUser,
  mockTrainingSettingsDto,
  mockUpdatedUserDto,
  mockRequestCollectionUpdateDto,
  mockInvalidRequestUserTrainingUpdateDto,
  mockInvalidWordsForCollectionDto,
  mockWordsForCollectionDto,
} from './mockData';
import { UserDto } from '../src/user/dto';
import { Tokens } from '../src/auth/types';
import { generateRandomString } from '../src/common/utils';
import { UserWordProgressExtended } from '../src/collection/dto';
import calculateNextTrainingDate from '../src/collection/utils/calculateNextTrainingDate';
import { extractTokensFromCookies, verifyAuthResponse } from './utils';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let requestAgent: supertest.SuperTest<supertest.Test>;
  let requestAgentForSecondUser: supertest.SuperTest<supertest.Test>;
  let unAuthedRequestAgent: supertest.SuperTest<supertest.Test>;
  let currentTokensWithCookies: Tokens & { cookiesString: string };
  let user: UserWithTrainingSettings;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      })
    );
    await app.init();
    await app.listen(3333);
    requestAgent = supertest.agent(app.getHttpServer());
    requestAgentForSecondUser = supertest.agent(app.getHttpServer());
    jwtService = app.get(JwtService);
    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();
  });

  afterAll(() => {
    app.close();
  });

  beforeEach(() => {
    unAuthedRequestAgent = supertest.agent(app.getHttpServer());
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should throw if no body provided', () =>
        unAuthedRequestAgent.post('/auth/signup').expect(400));

      it('should throw if password empty', () =>
        unAuthedRequestAgent
          .post('/auth/signup')
          .send({
            email: mockSignUpDto.email,
          })
          .expect(400));

      it('should throw if email is invalid', () =>
        unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDtoInvalidEmail)
          .expect(400));

      it('should throw if name is invalid', () =>
        unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDtoInvalidName)
          .expect(400));

      it('should throw if password is invalid', () =>
        unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDtoInvalidPassword)
          .expect(400));

      it('should signup', async () => {
        await unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDto)
          .expect(201)
          .expect((res) => {
            verifyAuthResponse(res, jwtService);
            user = res.body;
          });
        // and second user for tests
        await requestAgentForSecondUser
          .post('/auth/signup')
          .send(mockSignUpSecondUser)
          .expect(201);
      });

      it('should throw if user already exists', async () => {
        await unAuthedRequestAgent
          .post('/auth/signup')
          .send(mockSignUpDto)
          .expect(403);
      });
    });

    describe('Signin', () => {
      it('should throw if no body provided', () =>
        unAuthedRequestAgent.post('/auth/signin').expect(400));

      it('should throw if email empty', () =>
        unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            password: mockSignUpDto.password,
          })
          .expect(400));

      it('should throw if password empty', () =>
        unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            email: mockSignUpDto.email,
          })
          .expect(400));

      it('should throw if email is not valid', () =>
        unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            ...mockSignUpDtoInvalidEmail,
          })
          .expect(400));

      it('should throw if password length is less than 8', () =>
        unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            ...mockSignUpDtoInvalidPassword,
          })
          .expect(400));

      it('should throw if password does not contain a number', () =>
        unAuthedRequestAgent
          .post('/auth/signin')
          .send({
            email: mockSignUpDto.email,
            password: 'PasswordWithoutNumber',
          })
          .expect(400));

      it('should signin', async () => {
        await requestAgent
          .post('/auth/signin')
          .send(mockSignUpDto)
          .expect(200)
          .expect((res) => {
            verifyAuthResponse(res, jwtService);
            // Extract cookies from the response
            currentTokensWithCookies = extractTokensFromCookies(
              res.headers['set-cookie']
            );
          });
      });
    });
  });

  describe('Collections', () => {
    let collectionId: number;
    it('should get public collections if not authenticated', async () => {
      await unAuthedRequestAgent.get('/collections/public').expect(200);
    });

    it('should not get private collections if not authenticated', async () => {
      await unAuthedRequestAgent
        .post('/collections')
        .send(mockRequestCollectionCreateDto)
        .expect(401);
    });

    it('should throw if no body provided', async () => {
      await requestAgent.post('/collections').expect(400);
    });

    it('should throw if name is invalid', async () => {
      await requestAgent
        .post('/collections')
        .send({
          ...mockRequestCollectionCreateDto,
          name: '',
        })
        .expect(400);
    });

    it('should throw if name length is short', async () => {
      await requestAgent
        .post('/collections')
        .send({
          ...mockRequestCollectionCreateDto,
          name: 'AB',
        })
        .expect(400);
    });

    it('should throw if name length is exceeded', async () => {
      await requestAgent
        .post('/collections')
        .send({
          ...mockRequestCollectionCreateDto,
          name: generateRandomString(31),
        })
        .expect(400);
    });

    it('should throw if description length is short', async () => {
      await requestAgent
        .post('/collections')
        .send({
          ...mockRequestCollectionCreateDto,
          description: 'AB',
        })
        .expect(400);
    });

    it('should throw if description length is exceeded', async () => {
      await requestAgent
        .post('/collections')
        .send({
          ...mockRequestCollectionCreateDto,
          description: generateRandomString(101),
        })
        .expect(400);
    });

    it('should create a collection successfully', async () => {
      // Successful collection creation
      const response = await requestAgent
        .post('/collections')
        .send(mockRequestCollectionCreateDto)
        .expect(201);

      expect(response.body.name).toEqual(mockRequestCollectionCreateDto.name);
      expect(response.body.description).toEqual(
        mockRequestCollectionCreateDto.description
      );
      expect(response.body.isPublic).toEqual(
        mockRequestCollectionCreateDto.isPublic
      );
      collectionId = response.body.id;
      // and private collection for second user
      await requestAgentForSecondUser
        .post('/collections')
        .send({ ...mockRequestCollectionCreateDto, isPublic: false })
        .expect(201);
    });

    it('should throw if collection already exists', async () => {
      await requestAgent
        .post('/collections')
        .send(mockRequestCollectionCreateDto)
        .expect(403);
    });

    it('should get only owned & public collections', async () => {
      // should not get collection from second user
      await requestAgent
        .get('/collections')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
        });
      // second user should get his own and 1 public form first user
      await requestAgentForSecondUser
        .get('/collections')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
        });
    });

    it('should not update with invalid data', async () => {
      // name is important
      await requestAgent
        .put(`/collections/${collectionId}`)
        .send({ name: '' })
        .expect(400);

      await requestAgent
        .put(`/collections/${collectionId}`)
        .send({ name: 'AB' })
        .expect(400);

      // all other fields are optional, but we validate them if provided
      await requestAgent
        .put(`/collections/${collectionId}`)
        .send(mockInvalidRequestCollectionUpdateDto)
        .expect(400)
        .expect((res) => {
          const { message } = res.body;
          expect(message.length).toBeGreaterThanOrEqual(
            Object.keys(mockInvalidRequestCollectionUpdateDto).length
          );
        });
    });

    it('should update collection', async () => {
      await requestAgent
        .put(`/collections/${collectionId}`)
        .send(mockRequestCollectionUpdateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toEqual(mockRequestCollectionUpdateDto.name);
          expect(res.body.description).toEqual(
            mockRequestCollectionUpdateDto.description
          );
          expect(res.body.image).toEqual(mockRequestCollectionUpdateDto.image);
        });
    });

    it('should not delete collection if not authenticated', async () => {
      await unAuthedRequestAgent
        .delete(`/collections/${collectionId}`)
        .expect(401);
    });

    it('should not delete collection if not owner', async () => {
      await requestAgentForSecondUser
        .delete(`/collections/${collectionId}`)
        .expect(403);
    });

    it('should delete collection', async () => {
      await requestAgent.delete(`/collections/${collectionId}`).expect(200);

      await requestAgent
        .get('/collections')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(0);
        });
    });
  });

  describe('Words', () => {
    let collectionId: number;
    const words = mockWordsForCollectionDto;

    // create collection
    beforeAll(async () => {
      await requestAgent
        .post('/collections')
        .send({ mockRequestCollectionCreateDto, name: 'for words' })
        .expect(201)
        .expect((res) => {
          collectionId = res.body.id;
        });
    });

    it('should not get words from collection if not authenticated', async () => {
      await unAuthedRequestAgent.get(`/word/${collectionId}`).expect(401);
    });
    it('should not add words to collection if not authenticated', async () => {
      await unAuthedRequestAgent
        .post(`/word/${collectionId}`)
        .send([mockWordsForCollectionDto])
        .expect(401);
    });
    it('should not add words to not owned collection', async () => {
      await requestAgentForSecondUser
        .post(`/word/${collectionId}`)
        .send([mockWordsForCollectionDto])
        .expect(403);
    });

    it('should not add invalid words to collection', async () => {
      // no body provided
      await requestAgent.post(`/word/${collectionId}`).expect(400);
      // empty values
      await requestAgent
        .post(`/word/${collectionId}`)
        .send([mockInvalidWordsForCollectionDto[0]])
        .expect(400);
      // length exceeds
      await requestAgent
        .post(`/word/${collectionId}`)
        .send([mockInvalidWordsForCollectionDto[1]])
        .expect(400);
    });

    it('should add words to collection', async () => {
      await requestAgent
        .post(`/word/${collectionId}`)
        .send(words)
        .expect(201)
        .expect((res) => {
          const { words: collectionWords } = res.body;
          expect(collectionWords).toHaveLength(words.length);
          expect(collectionWords[0].word).toEqual(words[0].word);
          expect(collectionWords[0].translation).toEqual(words[0].translation);
        });
    });

    it('should get words from collection', async () => {
      await requestAgent
        .get(`/word/${collectionId}`)
        .expect(200)
        .expect((res) => {
          const collectionWords = res.body;
          expect(collectionWords).toHaveLength(words.length);
        });
    });

    it('should remove words from collection', async () => {
      await requestAgent
        .post(`/word/${collectionId}`)
        .send([])
        .expect(201)
        .expect((res) => {
          const { words: collectionWords } = res.body;
          expect(collectionWords).toHaveLength(0);
        });
    });
  });

  describe('Training', () => {
    let collectionId: number;
    const mockWords = mockWordsForCollectionDto;
    // let wordsFromServer: ResponseWordDto[];
    let userWordProgress: UserWordProgressExtended[];

    beforeAll(async () => {
      // create collection
      await requestAgent
        .post('/collections')
        .send({ ...mockRequestCollectionCreateDto, name: 'for training' })
        .expect(201)
        .expect((res) => {
          collectionId = res.body.id;
        });
      // add words to it
      await requestAgent
        .post(`/word/${collectionId}`)
        .send(mockWords)
        .expect(201)
        .expect((res) => {
          const { words: collectionWords } = res.body;
          // wordsFromServer = collectionWords;
          expect(collectionWords).toHaveLength(mockWords.length);
          expect(collectionWords[0].word).toEqual(mockWords[0].word);
          expect(collectionWords[0].translation).toEqual(
            mockWords[0].translation
          );
        });
    });
    it('should not get training progress if not authenticated', async () => {
      await unAuthedRequestAgent.get('/collections/train').expect(401);
    });

    it('should not train collection if not authenticated', async () => {
      await unAuthedRequestAgent
        .post(`/collections/${collectionId}`)
        .expect(401);
    });

    it('should not update training progress if not authenticated', async () => {
      await unAuthedRequestAgent
        .patch(`/collections/train`)
        .send(mockInvalidRequestUserTrainingUpdateDto)
        .expect(401);
    });

    it('should add collection words to training', async () => {
      await requestAgent.post(`/collections/${collectionId}`).expect(200);
    });

    it('should get valid training progress based on user preferences', async () => {
      await requestAgent
        .get('/collections/train')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(mockWords.length);
          expect(res.body[0].collectionId).toEqual(collectionId);
          expect(res.body[1].collectionId).toEqual(collectionId);
          userWordProgress = res.body;
        });
      // progress should have correct nextReview date according to user settings
      const { trainingSettings } = user;
      const nextReviewShouldBe = calculateNextTrainingDate(0, trainingSettings);
      // Convert both 'nextReviewShouldBe' and 'nextReviewFromResponse' to Date objects
      const nextReviewShouldBeDate = new Date(nextReviewShouldBe);
      const nextReviewFromResponseDate = new Date(
        userWordProgress[0].nextReview
      );
      // Calculate date difference in milliseconds
      const dateDifference = Math.abs(
        nextReviewFromResponseDate.getTime() - nextReviewShouldBeDate.getTime()
      );
      // Tolerance
      const toleranceInMilliseconds = 5000;
      // Check if the date difference falls within the acceptable tolerance
      expect(dateDifference).toBeLessThanOrEqual(toleranceInMilliseconds);
    });

    it('should not update training progress with invalid data', async () => {
      // it should always return actual userProgress even if sent data is not valid or ids is not correct
      await requestAgent
        .patch(`/collections/train`)
        .send([{ wordId: true, translationId: '0', sessionMistakes: null }])
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(userWordProgress);
        });
      await requestAgent
        .patch(`/collections/train`)
        .send(mockInvalidRequestUserTrainingUpdateDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(userWordProgress);
        });
    });
    it('should update training progress', async () => {
      const {
        translationId,
        translation: { wordId },
      } = userWordProgress[0];
      await requestAgent
        .patch(`/collections/train`)
        .send([{ wordId, translationId, sessionMistakes: 3 }])
        .expect(200)
        .expect((res) => {
          const updatedUserWordProgress: UserWordProgressExtended[] = res.body;
          // backend is filtering progress by date, so it should return 1 less word
          expect(updatedUserWordProgress).toHaveLength(
            userWordProgress.length - 1
          );
          const wordProgress: UserWordProgressExtended =
            updatedUserWordProgress.find(
              (x: UserWordProgressExtended) => x.translationId === translationId
            );
          expect(wordProgress).toBeUndefined();
        });
    });

    it('should untrain colection words', async () => {
      await requestAgent
        .patch(`/collections/${collectionId}`)
        .expect(200)
        .expect((res) => {
          const updatedUserWordProgress: UserWordProgressExtended[] = res.body;
          expect(updatedUserWordProgress).toHaveLength(0);
        });
    });
  });

  describe('User', () => {
    it('should not get current user from /user without cookies', async () => {
      await unAuthedRequestAgent.get('/user').expect(401);
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
          // there should be a lot of validation errors inside message
          expect(message.length).toBeGreaterThanOrEqual(
            Object.keys(mockInvalidEditUserDto).length +
              Object.keys(mockInvalidEditUserDto.trainingSettings).length
          );
        });
    });

    it('should not update user email if it already exist', async () => {
      await requestAgent
        .patch('/user')
        .send({
          email: mockSignUpSecondUser.email,
          name: mockSignUpSecondUser.name,
        })
        .expect(409);
    });

    it('should update user', async () => {
      await requestAgent
        .patch('/user')
        .send(mockUpdatedUserDto)
        .expect(200)
        .expect((res) => {
          expect(res.headers['set-cookie']).toBeTruthy();
          const newTokensWithCookies = extractTokensFromCookies(
            res.headers['set-cookie']
          );
          // new auth token comparing with old one
          expect(newTokensWithCookies.accessToken).not.toEqual(
            currentTokensWithCookies.accessToken
          );
          currentTokensWithCookies = newTokensWithCookies;
          // check for updated user
          user = res.body;
          expect(user.email).toBe(mockUpdatedUserDto.email);
          expect(user.name).toBe(mockUpdatedUserDto.name);
          expect(user.trainingSettings).toBeDefined();
          expect(user.trainingSettings).toEqual(
            expect.objectContaining(mockTrainingSettingsDto)
          );
        });
    });

    it('should not refresh tokens in cookies without valid cookies', async () =>
      unAuthedRequestAgent.get('/auth/refresh').expect(401));

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
            res.headers['set-cookie']
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
            cookies.some((cookie: string) => cookie.includes('access_token=;'))
          ).toBeTruthy();
          expect(
            cookies.some((cookie: string) => cookie.includes('refresh_token=;'))
          ).toBeTruthy();
        });
    });
  });
});
