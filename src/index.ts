import 'reflect-metadata';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { nanoid } from 'nanoid';
import {createConnection} from 'typeorm';
import URL from './url';
import { LinkdNotFound, LinkdAlreadyExists } from './errors';

const app = new Koa();
const port = parseInt(process.env.PORT ?? '3000', 10);
const baseUrl = process.env.BASE_URL ?? 'https://linkd.pw';

createConnection({
  type: 'postgres',
  url: process.env.DB_URI ?? 'postgres://linkd:linkd@localhost:5432/linkd',
  entities: [ URL ],
  synchronize: true
}).then(() => {
  console.log('db   => connection opened to database');
});

app.use(bodyParser());

const router = new Router();

// TODO create a more descriptive route
router
  .get('root', '/', (ctx) => {
    ctx.body = {
      message: 'Welcome to linkd'
    };
  })
  .post('new', '/url', async (ctx) => {
    const url = ctx.request.body.url;
    if (!url) {
      ctx.status = 400;
      ctx.body = {
        message: 'Field `url` is required.',
        data: {}
      };
      return;
    }

    const alias = ctx.request.body.alias ?? nanoid(5);

    try {
      const existing = await URL.find({ alias });
      if (existing.length > 0) {
        throw new LinkdAlreadyExists();
      }

      const newUrl = new URL();
      newUrl.alias = alias;
      newUrl.url = url;
      newUrl.accessKey = nanoid(16);
      newUrl.save();

      ctx.status = 201;
      ctx.body = {
        message: 'Short URL created.',
        data: { ...newUrl },
        url: `${baseUrl}/${newUrl.alias}`
      };
    } catch (e) {
      let message = 'Whoops! Something went wrong on our end!';
      if (e instanceof LinkdAlreadyExists) {
        message = "A link with that alias/ID already exists!";
      }

      let stack = {};
      if (process.env.NODE_ENV == 'production') stack = { stack: e.stack };

      ctx.status = e.statusCode ?? 500;
      ctx.body = {
        ...stack,
        message
      };
   }
  })
  .get('/:alias', async (ctx) => {
    const { alias } = ctx.params;

    try {
      const urls = await URL.find({ alias });
      if(urls.length == 0) {
        throw new LinkdNotFound(alias);
      }

      urls[0].hits += 1;
      urls[0].save();

      return ctx.redirect(urls[0].url);
    } catch (e) {
      let message = 'Whoops! Something went wrong on our end!';
      if (e instanceof LinkdNotFound) {
        message = "A link with that alias/ID was not found!";
      }

      let stack = {};
      if (process.env.NODE_ENV == 'production') stack = { stack: e.stack };

      ctx.status = e.statusCode ?? 500;
      ctx.body = {
        ...stack,
        message
      };
    }
  });

// TODO allow deleting existing urls based on a provided owner key

// TODO provide endpoint to see all urls

app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(cors());

// TODO add per-request logging

app.listen(port, () => {
  // TODO implement a better logging structure
  //   maybe something like "info => Listening on port *:${port}"
  console.log(`Listening on *:${port}`);
});
