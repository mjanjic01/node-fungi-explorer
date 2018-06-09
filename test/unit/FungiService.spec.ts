import * as chai from 'chai';

import { HerbariumType, IHerbariumRepository, User } from '../../src/domain';
import { container, TYPES } from '../../src/ioc';
import '../../src/ioc/loader';
import { IFungiService } from '../../src/services/FungiService';

class MockHerbariumRepository implements IHerbariumRepository {
  public getByUserId(userId: number): Promise<Array<any>> {
    return Promise.resolve([]);
  }
  public getAll(): Promise<Array<any>> {
    return Promise.resolve([]);
  }
  public getById(id: number): Promise<any> {
    return Promise.resolve();
  }
  public insert(entity: any): Promise<any> {
    return Promise.resolve();
  }
  public update(entity: any): Promise<any> {
    return Promise.resolve();
  }
  public delete(id: number): Promise<any> {
    return Promise.resolve();
  }
  public deleteAll(): Promise<void> {
    return Promise.resolve();
  }
}

let fungiService: IFungiService;
let originalRepository: IHerbariumRepository;

before(async () => {
  fungiService = container.get(TYPES.FungiService);
  originalRepository = container.get(TYPES.HerbariumRepository);
  container.rebind(TYPES.HerbariumRepository).toConstantValue(new MockHerbariumRepository());
});

describe('FungiService', () => {
  it('should throw error if user does not exist', async () => {
    try {
      await fungiService.createHerbarium({
        description: null,
        isPrivate: true,
        name: 'test herbarium',
        type: {
          name: 'test type',
        },
      }, {
        id: 0,
      } as User);
      chai.assert.fail(null, null, 'Expected service to throw an error');
    } catch (e) {
      chai.expect(e).to.be.an('error');
    }
  });
});

after(async () => {
  await import('../../src/dataAccess/HerbariumRepository');
});
