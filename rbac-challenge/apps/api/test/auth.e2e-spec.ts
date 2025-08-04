import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register a test user before running login tests
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
        organizationId: 1, // Use a valid org ID from your test DB
        role: 'Admin'
      });
  });

  it('/auth/login (POST) - fail with wrong credentials', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'wrong@example.com', password: 'badpass' })
      .expect(401);
  });

  // Add a test user to your DB before running this test
  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'testpassword' })
      .expect(201)
      .expect(res => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});