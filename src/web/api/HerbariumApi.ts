import { Request, Response } from 'express';
import { body, param, Result, validationResult } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
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

@controller('/api/v1/herbarium', authenticationMiddleware)
export default class HerbariumApi {
  constructor(@inject(TYPES.FungiService) private fungiService: IFungiService) { }

  @httpGet('/')
  public async getHerbariums(@request() req, @response() res, @queryParam('userId') userId: number) {
    return res.json(await this.fungiService.getHerbariumsByUser(req.user.id));
  }

  @httpPost(
    '/:herbariumId',
    body('name').not().isEmpty().withMessage('Naziv je obvezan'),
    body('isPrivate').not().isEmpty().withMessage('Vidljivost je obvezna'),
    param('herbariumId').isNumeric(),
    sanitize('isPrivate').toBoolean(),
  )
  public async editHerbarium(@request() req, @response() res, @requestParam('herbariumId') herbariumId: number) {
    const errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.mapped());
    }

    const {
      name,
      description,
      observations,
      isPrivate,
    } = req.body;

    for (const observation of observations) {
      await this.fungiService.setObservationHerbarium(observation.id, herbariumId);
    }
    const herbarium = await this.fungiService.updateHerbarium({
      description,
      id: herbariumId,
      isPrivate,
      name,
    });

    return res.json(herbarium);
  }

  @httpDelete('/:herbariumId', param('herbariumId').isNumeric())
  public async deleteHerbarium(@request() req, @response() res, @requestParam('herbariumId') herbariumId: number) {
    const errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.mapped());
    }

    const herbarium = await this.fungiService.deleteHerbarium(herbariumId);
    return res.json(herbarium);
  }
}
