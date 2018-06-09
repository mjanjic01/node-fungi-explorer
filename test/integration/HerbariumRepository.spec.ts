import * as chai from 'chai';

import {
  Herbarium,
  HerbariumType,
  IHerbariumRepository,
  IHerbariumTypeRepository,
} from '../../src/domain';
import { container, TYPES } from '../../src/ioc';
import '../../src/ioc/loader';

let herbariumRepository: IHerbariumRepository;
let herbariumTypeRepository: IHerbariumTypeRepository;
let testHerbariumType: HerbariumType;
let testHerbarium: Herbarium;
let mockHerbarium: Herbarium;

before(async () => {
  herbariumRepository = container.get(TYPES.HerbariumRepository);
  herbariumTypeRepository = container.get(TYPES.HerbariumTypeRepository);
  testHerbariumType = await herbariumTypeRepository.insert({
    name: 'test herbarium type',
  });

  mockHerbarium = {
    description: 'test description',
    isPrivate: true,
    name: 'test name',
    type: testHerbariumType,
  };
});

describe('HerbariumRepostory', () => {
  it('should get all database table entries', async () => {
    const result = await herbariumRepository.getAll();
    chai.expect(result.length).equals(0, 'Expected 0 results on empty database');
  });

  it('should insert new record into database successfully', async () => {
    testHerbarium = await herbariumRepository.insert(mockHerbarium);
    chai.expect(testHerbarium.id, 'Expected entitiy to have an id').to.exist;
  });

  it('should read the inserted record from the database', async () => {
    const herbarium = await herbariumRepository.getById(testHerbarium.id);
    chai.expect(herbarium).to.deep.include(mockHerbarium);
  });
});

after(async () => {
  await herbariumRepository.deleteAll();
  await herbariumTypeRepository.deleteAll();
});
