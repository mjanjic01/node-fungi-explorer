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
import { IObservationService } from '../../services/ObservationService';
import authenticationMiddleware from '../middleware/authentication';
import FungiViewModel from '../models/FungiViewModel';

@controller('/observation')
export default class ObservationController {
  constructor(@inject(TYPES.ObservationService) private observationService: IObservationService) { }

  @httpGet('/', authenticationMiddleware)
  public async getObservations(req, res) {
    return res.render('observation', {
      observations: await this.observationService.getObservations(),
    });
  }

  @httpGet('/new', authenticationMiddleware)
  public async getCreateObservation(req, res) {
    return res.render('observation/new', {
      fungi: this.mapToViewModels(await this.observationService.getFungi()),
    });
  }

  @httpPost(
    '/new',
    authenticationMiddleware,
    body('fungi').not().isEmpty().withMessage('Gljiva je obvezna'),
    body('date').not().isEmpty().withMessage('Datum je obvezan'),
  )
  public async createObservation(req, res) {
    const errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('observation/new', {
        data: req.body,
        errors: errors.mapped(),
        fungi: this.mapToViewModels(await this.observationService.getFungi()),
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

    await this.observationService.createObservation({
      date,
      description,
      fungi,
      image: image.path,
      location: {
        latitude,
        longitude,
      },
    });

    return res.redirect('/observation');
  }

  private mapToViewModels(fungi: Array<Fungi>): Array<FungiViewModel> {
    return fungi.map((f) => new FungiViewModel(f));
  }
}
