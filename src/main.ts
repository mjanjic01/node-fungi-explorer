import { createConnection } from 'typeorm';

let app;
createConnection().then(async () => {
  app = await import('./web');
});

export default app;
