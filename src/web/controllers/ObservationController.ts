import { Request, Response } from 'express';
import { body, Result, validationResult } from 'express-validator/check';
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

import { Fungi, IObservationRepository, Observation } from '../../domain';
import { TYPES } from '../../ioc';
import { IFungiService } from '../../services/FungiService';
import authenticationMiddleware from '../middleware/authentication';

@controller('/observation', authenticationMiddleware)
export default class ObservationController {
  constructor(@inject(TYPES.FungiService) private fungiService: IFungiService) { }

  @httpGet('/')
  public async getObservations(req, res) {
    return res.render('observation', {
      observations: await this.fungiService.getObservations(),
    });
  }

  @httpGet('/new')
  public async getCreateObservation(req, res) {
    return res.render('observation/new', {
      fungi: await this.fungiService.getFungi(),
    });
  }

  @httpPost(
    '/new',
    body('fungi').not().isEmpty().withMessage('Gljiva je obvezna'),
    body('date').not().isEmpty().withMessage('Datum je obvezan'),
  )
  public async createObservation(req, res) {
    const errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('observation/new', {
        data: req.body,
        errors: errors.mapped(),
        fungi: await this.fungiService.getFungi(),
      });
    }
    const image = req.file || {};
    const {
      date,
      description,
      fungi,
      latitude,
      longitude,
    } = req.body;

    const { id } = await this.fungiService.createObservation({
      date,
      description,
      fungi,
      image: image.path,
      location: {
        latitude,
        longitude,
      },
    });

    return res.redirect(`/observation/${id}`);
  }
}
