import { Request, Response } from 'express';
import {
  controller,
  httpGet,
  response,
} from 'inversify-express-utils';

@controller('/')
export default class HomeController {

  @httpGet('/')
  public async getHome(req: Request, res: Response) {
    return res.render('home');
  }
}
