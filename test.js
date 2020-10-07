let assert = require('assert').strict;
let fetch = require('node-fetch');
let Koa = require('koa');
let KoaBody = require('@seregpie/koa-body');

let KoaRoute = require('./index');

(async () => {

	let items = [];
	let app = new Koa();
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
	await new Promise(resolve => {
		app.server = app.listen(resolve);
	});
	let {port} = app.server.address();
	let origin = `http://localhost:${port}`;
	{
		let res = await fetch(`${origin}/items`, {
			method: 'POST',
			body: JSON.stringify({a: 1}),
		});
		let itemIndex = Number.parseInt(await res.text(), 10);
		assert.equal(itemIndex, items.length - 1);
	}
	{
		let res = await fetch(`${origin}/items`, {
			method: 'POST',
			body: JSON.stringify({b: 2}),
		});
		let itemIndex = Number.parseInt(await res.text(), 10);
		assert.equal(itemIndex, items.length - 1);
	}
	{
		let itemIndex = 1;
		let res = await fetch(`${origin}/items/${itemIndex}`);
		let item = await res.json();
		assert.deepEqual(item, items[itemIndex]);
	}
	await new Promise(resolve => {
		app.server.close(resolve);
	});

})();
