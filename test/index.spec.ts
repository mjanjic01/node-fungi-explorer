import { Application } from 'express';
import { agent } from 'supertest';

import server from '../src/index.js';

let app: Application;
server.then((serverInstance) => {
  app = serverInstance.default;
  run();
});
after(process.exit.bind(null, 0));

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
