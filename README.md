# KoaRoute

A simple route middleware.

## dependencies

- [PathToRegExp](https://github.com/pillarjs/path-to-regexp)

## setup

```shell
npm i @seregpie/koa-route
```

## usage

```javascript
let Koa = require('koa');
let KoaRoute = require('@seregpie/koa-route');

let app = new Koa();

let items = [];

app.use(KoaRoute.post('/items', async ctx => {
  let item = await KoaBody.json(ctx);
  let itemIndex = items.length;
  items.push(item);
  ctx.body = itemIndex;
}));

app.use(KoaRoute.get('/items/:itemIndex', ctx => {
  let {itemIndex} = ctx.params;
  let item = items[itemIndex];
  ctx.body = JSON.stringify(item);
}));
```
