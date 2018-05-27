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

@controller('/herbarium', authenticationMiddleware)
export default class HerbariumController {
  constructor(@inject(TYPES.FungiService) private fungiService: IFungiService) { }

  @httpGet('/')
  public async getHerbariums(@request() req, @response() res, @queryParam('userId') userId: number) {
    return res.render('herbarium/', {
      herbariums: await this.fungiService.getHerbariumsByUser(req.user.id),
      types: await this.fungiService.getHerbariumTypes(),
    });
  }

  @httpGet('/new')
  public async getCreateHerbarium(@request() req, @response() res) {
    return res.render('herbarium/new', {
      types: await this.fungiService.getHerbariumTypes(),
    });
  }

  @httpPost(
    '/new',
    body('name').not().isEmpty().withMessage('Naziv je obvezan'),
    body('type').not().isEmpty().withMessage('Vrsta je obvezana'),
    body('isPrivate').not().isEmpty().withMessage('Vidljivost je obvezna'),
    sanitize('isPrivate').toBoolean(),
  )
  public async createHerbarium(@request() req, @response() res) {
    const errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('herbarium/new', {
        data: req.body,
        errors: errors.mapped(),
      });
    }

    const {
      name,
      description,
      type,
      isPrivate,
    } = req.body;

    const { id } = await this.fungiService.createHerbarium({
      description,
      isPrivate,
      name,
      type,
    }, req.user);

    return res.redirect(`/herbarium/${id}`);
  }

  @httpGet('/:herbariumId')
  public async herbariumDetails(@request() req, @response() res, @requestParam('herbariumId') herbariumId: number) {
    let herbarium;
    try {
      herbarium = await this.fungiService.getHerbariumById(herbariumId, req.user);
    } catch (err) {
      return res.render('error/403');
    }

    if (!herbarium) {
      return res.render('error/404');
    }

    return res.render('herbarium/details', {
      herbarium,
    });
  }

  @httpGet('/edit/:herbariumId')
  public async getEditHerbarium(@request() req, @response() res, @requestParam('herbariumId') herbariumId: number) {
    let herbarium;
    try {
      herbarium = await this.fungiService.getHerbariumById(herbariumId, req.user);
    } catch (err) {
      return res.render('error/403');
    }

    if (!herbarium) {
      return res.render('error/404');
    }

    return res.render('herbarium/edit', {
      data: herbarium,
      types: await this.fungiService.getHerbariumTypes(),
    });
  }

  @httpPost(
    '/edit/:herbariumId',
    body('name').not().isEmpty().withMessage('Naziv je obvezan'),
    body('type').not().isEmpty().withMessage('Vrsta je obvezana'),
    body('isPrivate').not().isEmpty().withMessage('Vidljivost je obvezna'),
    param('herbariumId').isNumeric(),
    sanitize('isPrivate').toBoolean(),
  )
  public async editHerbarium(@request() req, @response() res, @requestParam('herbariumId') herbariumId: number) {
    const errors: Result = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render(`herbarium/edit`, {
        data: {
          ...req.body,
          id: herbariumId,
        },
        errors: errors.mapped(),
      });
    }

    const {
      name,
      description,
      type,
      isPrivate,
    } = req.body;

    const { id } = await this.fungiService.updateHerbarium({
      description,
      id: herbariumId,
      isPrivate,
      name,
      type,
    });

    return res.redirect(`/herbarium/${id}`);
  }
}
