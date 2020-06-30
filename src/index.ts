import 'reflect-metadata';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { nanoid } from 'nanoid';

@Entity()
class URL extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ unique: true, nullable: false })
  public alias!: string;

  @Column({ nullable: false })
  public url!: string;

  @Column({ unique: true, nullable: false })
  public accessKey!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;

  @DeleteDateColumn()
  public deletedAt!: Date;

}

const app = new Koa();
const port = parseInt(process.env.PORT ?? '3000', 10);

app.use(bodyParser());

const router = new Router({ prefix: '/' });

router.get('/', (ctx) => {
  ctx.body = {
    message: 'Welcome to linkd'
  };
});

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

app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(cors());

app.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
