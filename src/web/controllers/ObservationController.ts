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

import { IObservationRepository, Observation } from '../../domain';
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
      fungi: (await this.observationService.getFungi()).map((fungi) => new FungiViewModel(fungi)),
    });
  }

  @httpPost('/new', authenticationMiddleware)
  public async createObservation(req, res) {
    const image = req.file;
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
}
