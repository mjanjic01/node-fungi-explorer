import { Container } from 'inversify';
import {
  autoProvide,
  makeProvideDecorator,
} from 'inversify-binding-decorators';
import { Connection, createConnection } from 'typeorm';

import 'reflect-metadata';
import TYPES from './types';

const container = new Container();
const Provide = makeProvideDecorator(container);

// DI for DB connection is tricky, beware of hacks
// tslint:disable
container
  .bind<Connection>(TYPES.DbConnectionProvider)
  .toDynamicValue((context) => {
    // @ts-ignore
    let dbContext: Connection = {
      getRepository: () => { },
    };
    createConnection().then((connection: Connection) => {
      dbContext = connection;
      container.rebind<Connection>(TYPES.DbConnectionProvider).toConstantValue(connection);
      // tslint:disable-next-line no-console
      console.log(`Connected to database: ${connection.name}`);
    })
      .catch((e) => {
        // tslint:disable-next-line no-console
        console.error(`Failed to connect to database: ${e}`);
      });
    return dbContext;
  })
  .inSingletonScope();
// tslint:enable

export {
  container,
  Provide,
};
