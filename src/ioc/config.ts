import { Container } from 'inversify';
import {
  autoProvide,
  makeProvideDecorator,
} from 'inversify-binding-decorators';
import { Connection, getConnection } from 'typeorm';

import 'reflect-metadata';
import TYPES from './types';

const container = new Container();
const Provide = makeProvideDecorator(container);

export {
  container,
  Provide,
};
