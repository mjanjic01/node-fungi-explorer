import { agent } from 'supertest';

import app from '../src';

describe('GET /', () => {
  it('should return 200 OK', (done) => {
    agent(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /fungi unauthenticated', () => {
  it('should return 200 OK', (done) => {
    agent(app)
      .get('/fungi')
      .redirects(1)
      .expect(200, done);
  });
});
