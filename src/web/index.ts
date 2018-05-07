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
import localsMiddleware from './middleware/locals';

const server = new InversifyExpressServer(container);

const RedisStore = connectRedis(session);
const upload = multer({ dest: 'uploads/' });

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

server.setConfig((app) => {
    app.locals.title = 'Gljivar';
    dotenv.config();

    if (process.env.NODE_ENV === 'development') {
      app.use(developmentMiddleware);
    }

    app.use(assetsMiddleware);
    app.use(compression());
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(session({
      name: 'sess-id',
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new RedisStore(),
    }));

    app.use(upload.single('image'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(csrf());
    app.use(helmet());
    app.use(localsMiddleware);

    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use('/uploads', authenticationMiddleware, express.static(path.resolve(process.cwd(), 'uploads')));
});

const serverInstance = server.build();
serverInstance.get('*', (req, res) => res.render('error/404'));
serverInstance.listen(serverInstance.get('port'));

// tslint:disable-next-line no-console
console.log(`Server started on http://localhost:${serverInstance.get('port')}`);

export default serverInstance;
