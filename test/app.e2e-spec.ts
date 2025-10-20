// test/app.e2e-spec.ts

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-var-requires */
import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
// Impor pool dari db

const db = require('../dist/db.js');

describe('Alur Tes E2E Lengkap untuk API Blog', () => {
  let app: INestApplication;
  let token: string;
  let postId: number;
  const randomEmail = `testuser_${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // == Kelompok Tes Autentikasi (Auth) ==
  // Tes ini memastikan pengguna bisa mendaftar dan login.
  // =====================================

  it('/users/register (POST) - Mendaftarkan user baru', () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: randomEmail,
        password: 'password123',
        name: 'User Tes E2E Nest',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });

  it('/users/login (POST) - Login user dan dapatkan token', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: randomEmail,
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    token = response.body.accessToken; // Token disimpan untuk tes berikutnya
  });

  // == Kelompok Tes Postingan (Posts) ==
  // Tes ini memastikan proteksi rute (AuthGuard) dan pembuatan post bekerja.
  // =====================================

  it('/posts (POST) - Gagal membuat post tanpa token', () => {
    // Tes ini penting untuk memastikan AuthGuard berfungsi.
    return request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'No Token Post', content: 'Should fail' })
      .expect(401); // Harus ditolak karena tidak ada token
  });

  it('/posts (POST) - Berhasil membuat post dengan token', async () => {
    // Tes ini memastikan pengguna yang login bisa membuat post.
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`) // Menggunakan token
      .send({
        title: 'My First NestJS Post',
        content: 'Created via E2E test',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    postId = response.body.id; // ID post disimpan untuk tes komentar dan like
  });

  // == Kelompok Tes Komentar (Comments) ==
  // Tes ini memastikan pengguna yang login bisa berkomentar di post.
  // ======================================

  it('/posts/:postId/comments (POST) - Berhasil membuat komentar', () => {
    return request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'NestJS E2E Comment!' })
      .expect(201);
  });

  // == Kelompok Tes Like / Unlike ==
  // Tes ini memastikan pengguna yang login bisa like dan unlike post.
  // ================================

  it('/posts/:id/like (POST) - Berhasil like post', () => {
    return request(app.getHttpServer())
      .post(`/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Post liked successfully');
      });
  });

  it('/posts/:id/like (DELETE) - Berhasil unlike post', () => {
    return request(app.getHttpServer())
      .delete(`/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Post unliked successfully');
      });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (db && db.pool && typeof db.pool.end === 'function') {
      await db.pool.end();
    } else {
      console.warn(
        'DB pool not found or could not be closed during test cleanup.',
      );
    }
  });
});
