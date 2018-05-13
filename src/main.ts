import { Connection, createConnection } from 'typeorm';

let app;
createConnection()
  .then(async (connection: Connection) => {
    app = await import('./web');

    // tslint:disable-next-line no-console
    console.log(`Connected to database: ${connection.options.database} - ${connection.name}`);
  })
  .catch((e) => {
    // tslint:disable-next-line no-console
    console.error(`Failed to connect to database: ${e}`);
  });

export default app;
