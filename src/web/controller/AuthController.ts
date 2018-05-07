import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
} from 'inversify-express-utils';

import { TYPES } from '../../ioc';
import { IAuthService } from '../../services/AuthService';

@controller('/auth')
export default class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) { }

  @httpGet('/')
  public async getAuth(@response() res: Response) {
    res.redirect('/auth/login');
  }

  @httpGet('/login')
  public async getLogin(req, res) {
    return res.render('auth/login', {
      title: 'Prijava',
    });
  }

  @httpPost('/login')
  public async postLogin(req, res) {
    const {
      username,
      password,
    } = req.body;

    const user = await this.authService.loginUser(username, password);
    return this.loginUser(req, res, user);
  }

  @httpGet('/register')
  public async getRegister(req, res) {
    return res.render('auth/register', {
      title: 'Registracija',
    });
  }

  @httpPost('/register')
  public async postRegister(req, res) {
    const {
      username,
      password,
      repeatedPassword,
    } = req.body;

    const user = await this.authService.registerUser(username, password, repeatedPassword);
    return this.loginUser(req, res, user);
  }

  @httpGet('/logout')
  public async getLogout(req, res) {
    req.logout();
    return res.redirect('/auth/login');
  }

  private loginUser(req, res, user) {
    return req.login(user, () => res.redirect('/'));
  }
}
