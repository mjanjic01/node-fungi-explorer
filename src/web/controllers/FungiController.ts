import { Request, Response } from 'express';
import { sanitizeParam } from 'express-validator/filter';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  queryParam,
  request,
  requestParam,
  response,
} from 'inversify-express-utils';

import { Fungi, IFungiRepository } from '../../domain';
import { TYPES } from '../../ioc';
import { IFungiService } from '../../services/FungiService';
import authenticationMiddleware from '../middleware/authentication';
import FungiViewModel from '../models/FungiViewModel';

@controller('/fungi')
export default class FungiController {
  constructor(@inject(TYPES.FungiService) private fungiService: IFungiService) { }

  @httpGet('/', authenticationMiddleware)
  public async getFungi(@response() res: Response) {
    return res.render('fungi', {
      fungi: this.mapToViewModels(await this.fungiService.getFungi()),
    });
  }

  @httpGet('/search', authenticationMiddleware, sanitizeParam('query').trim())
  public async searchFungi(@response() res: Response, @queryParam('query') query: string) {
    const result = query ?
      await this.fungiService.searchFungi(query) :
      await this.fungiService.getFungi();

    return res.render('fungi/search', {
      data: { query },
      fungi: this.mapToViewModels(result),
    });
  }

  private mapToViewModels(fungi: Array<Fungi>): Array<FungiViewModel> {
    return fungi.map((f) => new FungiViewModel(f));
  }
}
