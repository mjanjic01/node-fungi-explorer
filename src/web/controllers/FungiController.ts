import { Request, Response } from 'express';
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
      fungi: (await this.fungiService.getFungi()).map((fungi) => new FungiViewModel(fungi)),
    });
  }

  @httpGet('/explore')
  public async exploreFungi(@response() res: Response) {
    // return res.render('fungi/explore', {
    //   fungi: (await this.fungiService.getFungi()).map((fungi) => new FungiViewModel(fungi)),
    // });
  }
}
