import { Connection, createConnection } from 'typeorm';
import { container, TYPES } from './ioc';

async function getConnectionConfig(): Promise<any> {
  if (process.env.NODE_ENV === 'test') {
    return await import('../ormconfig.test.json');
  } else {
    return await import('../ormconfig.json');
  }
}

const app = getConnectionConfig()
  .then(createConnection)
  .then(async (connection: Connection) => {
    container
      .bind<Connection>(TYPES.DbConnectionProvider)
      .toConstantValue(connection);

    const instance = await import('./web');

    // tslint:disable-next-line no-console
    console.log(`Connected to database: ${connection.options.database} - ${connection.name}`);
    return instance;
  })
  .catch((e) => {
    // tslint:disable-next-line no-console
    console.error(`Failed to connect to database: ${e}`);
    return null;
  });

export default app;
