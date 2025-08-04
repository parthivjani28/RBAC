import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tasks RBAC (e2e)', () => {
  let app: INestApplication;
  let ownerToken: string;
  let viewerToken: string;
  let taskId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login as owner
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'owner@rbac.com', password: 'ownerpass', organizationId: 1, role: 'Owner' });
    const ownerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'owner@rbac.com', password: 'ownerpass' });
    ownerToken = ownerLogin.body.access_token;

    // Register and login as viewer
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'viewer@rbac.com', password: 'viewerpass', organizationId: 1, role: 'Viewer' });
    const viewerLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'viewer@rbac.com', password: 'viewerpass' });
    viewerToken = viewerLogin.body.access_token;
  });

  it('Owner can create a task', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Owner Task' })
      .expect(201);
    expect(res.body.title).toBe('Owner Task');
    taskId = res.body.id;
  });

  it('Viewer cannot update owner task', async () => {
    await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ title: 'Hacked' })
      .expect(403);
  });

  it('Owner can update own task', async () => {
    await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Updated by Owner' })
      .expect(200);
  });
});
