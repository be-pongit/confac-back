import koa from 'koa';
import koaCors from 'kcors';
import koaBodyParser from 'koa-bodyparser';
import koaServe from 'koa-static';
import koaMongo from 'koa-mongo';

export const createApp = () => {
  const app = koa();
  app.use(koaCors());
  app.use(koaBodyParser());
  app.use(koaServe('./templates/'));

  const db = require('./config.json').db;
  app.use(koaMongo({
    uri: `mongodb://${db.host}:${db.port}/${db.db}`,
    max: 100,
    min: 1,
    timeout: 30000,
    log: false
  }));

  require('./resources/config.js').default(app);
  require('./resources/clients.js').default(app);
  require('./resources/invoices.js').default(app);

  return app;
};