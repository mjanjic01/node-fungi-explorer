import { inject } from 'inversify';

import { Fungi, IFungiRepository } from '../domain';
import { Provide, TYPES } from '../ioc';

export interface IFungiService {
  getFungi(): Promise<Array<Fungi>>
  createFungi(Fungi: Fungi): Promise<Fungi>
}

@Provide(TYPES.FungiService)
export class FungiService implements IFungiService {
  constructor(@inject(TYPES.FungiRepository) private fungiRepository: IFungiRepository) { }

  public async getFungi(): Promise<Array<Fungi>> {
    return await this.fungiRepository.getAll();
  }

  public async createFungi(fungi: Fungi): Promise<Fungi> {
    return await this.fungiRepository.insert(fungi);
  }
}
