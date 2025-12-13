const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

let token;

beforeAll(async () => {
  await mongoose.connect(
    'mongodb://127.0.0.1:27017/servicehub_test'
  );

  const userRes = await request(app)
    .post('/api/auth/signup')
    .send({
      name: 'Provider Test',
      email: 'provider@test.com',
      password: '12345678'
    });

  token = userRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

it('should create a booking', async () => {
  const res = await request(app)
    .post('/api/bookings/create')
    .set('Authorization', `Bearer ${token}`)
    .send({
      providerId: '507f191e810c19729de860ea',
      selectedDate: new Date().toISOString(),
      isLongTerm: false
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
});
