import 'reflect-metadata';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { nanoid } from 'nanoid';
import URL from './url';

const app = new Koa();
const port = parseInt(process.env.PORT ?? '3000', 10);

// TODO init typeorm

app.use(bodyParser());

const router = new Router({ prefix: '/' });

// TODO create a more descriptive route
router.get('/', (ctx) => {
  ctx.body = {
    message: 'Welcome to linkd'
  };
});

// TODO fix routing
router.post('/url', async (ctx) => {
  const url = ctx.request.body.url;
  if (!url) {
    ctx.status = 400;
    ctx.body = {
      message: 'Field `url` is required.',
      data: {}
    };
    return;
  }

  const alias = ctx.request.body.url ?? nanoid(5);

  try {
    const newUrl = new URL();
    newUrl.alias = alias;
    newUrl.url = url;
    await newUrl.save();

    ctx.status = 201;
    ctx.body = {
      message: 'Short URL created.',
      data: newUrl
    };
  } catch (e) {
    // TODO add error catching based on type
    const message = 'Whoops! Something went wrong on our end!';
    ctx.status = e.statusCode ?? 500;
    let stack = {};
    if (process.env.NODE_ENV == 'production') stack = e.stack;

    ctx.body = {
      ...stack,
      message
    };
  }
});

// TODO add redirect based on /:nanoid

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
