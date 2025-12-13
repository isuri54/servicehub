const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

beforeAll(async () => {
  await mongoose.connect(
    'mongodb://127.0.0.1:27017/servicehub_test'
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '0771234567'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it('should login existing user', async () => {
    await request(app).post('/api/auth/signup').send({
      name: 'Login Test',
      email: 'login@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
