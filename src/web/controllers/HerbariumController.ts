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

@controller('/herbarium', authenticationMiddleware)
export default class HerbariumController {
  constructor(@inject(TYPES.FungiService) private fungiService: IFungiService) { }

  @httpGet('/')
  public async getHerbariums(@response() res: Response, @queryParam('userId') userId: number) {
    return res.render('herbarium/', {
      herbariums: await this.fungiService.getHerbariumsByUser(1),
    });
  }
}
