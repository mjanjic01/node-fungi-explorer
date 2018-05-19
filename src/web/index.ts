import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as connectRedis from 'connect-redis';
import * as csrf from 'csurf';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as multer from 'multer';
import * as passport from 'passport';
import * as path from 'path';
import 'reflect-metadata';

import { InversifyExpressServer } from 'inversify-express-utils';

import { container } from '../ioc';
import '../ioc/loader';
import assetsMiddleware from './middleware/assets';
import authenticationMiddleware from './middleware/authentication';
import developmentMiddleware from './middleware/development';
import errorHandler from './middleware/errorHandler';
import localsMiddleware from './middleware/locals';

const CSRF_ERR_CODE = 'EBADCSRFTOKEN';
const SESSION_MAX_AGE = 7200000; // 2 * 60 * 60 * 1000 (2 hours)

const server = new InversifyExpressServer(container);

const RedisStore = connectRedis(session);
const upload = multer({ dest: 'uploads/' });

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

server.setConfig((app) => {
    app.locals.title = 'Gljivar';
    app.locals.data = {};
    app.locals.errors = {};

    dotenv.config();
    if (process.env.NODE_ENV === 'development') {
      app.use(developmentMiddleware);
    }

    app.use(assetsMiddleware);
    app.use(compression());
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');
    app.locals.basedir = app.get('views');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session({
      cookie: {
        maxAge: SESSION_MAX_AGE,
      },
      name: 'sess-id',
      resave: true,
      rolling: true,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new RedisStore(),
      unset: 'destroy',
    }));

    app.use(upload.single('image'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(csrf());
    app.use((err, req, res, next) => {
      if (err.code !== CSRF_ERR_CODE) {
        return next(err);
      }

      res.status(403);
      res.render('error/403');
    });
    app.use(helmet());
    app.use(localsMiddleware);
    app.use(errorHandler);

    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use('/uploads', authenticationMiddleware, express.static(path.resolve(process.cwd(), 'uploads')));
});

const serverInstance = server.build();
serverInstance.get('*', (req, res) => {
  res.status(404);
  res.render('error/404');
});
serverInstance.listen(serverInstance.get('port'));

// tslint:disable-next-line no-console
console.log(`Server started on http://localhost:${serverInstance.get('port')}`);

export default serverInstance;
