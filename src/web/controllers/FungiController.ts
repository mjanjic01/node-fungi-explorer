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

@controller('/fungi')
export default class FungiController {
  constructor(@inject(TYPES.FungiService) private fungiService: IFungiService) { }

  @httpGet('/', authenticationMiddleware)
  public async getFungi(@response() res: Response) {
    return res.render('fungi', {
      fungi: await this.fungiService.getFungi(),
    });
  }

  @httpGet('/search', authenticationMiddleware, sanitizeParam('query').trim())
  public async searchFungi(@response() res: Response, @queryParam('query') query: string) {
    return res.render('fungi/search', {
      data: { query },
      fungi: await this.fungiService.searchFungi(query),
    });
  }

  @httpGet('/:fungiId', authenticationMiddleware)
  public async fungiDetails(@response() res: Response, @requestParam('fungiId') fungiId: number) {
    const fungi = await this.fungiService.getFungiById(fungiId);

    if (!fungi) {
      return res.render('error/404');
    }

    const fungiObservations = await this.fungiService.fungiObservations(fungiId);
    const { images, locations } = fungiObservations.reduce((acc, observation) => {
      if (observation.location) {
        acc.locations.push(observation.location);
      }
      if (observation.image) {
        acc.images.push(observation.image);
      }
      return acc;
    }, {
      images: [],
      locations: [],
    });

    return res.render('fungi/details', {
      fungi,
      images,
      locations,
    });
  }
}
