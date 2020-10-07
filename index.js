let http = require('http');
let {match} = require('path-to-regexp');

let KoaRoute = {};

http.METHODS.forEach(method => {
	KoaRoute[method.toLowerCase()] = function(path, callback) {
		let matchPath = match(path, {decode: decodeURIComponent});
		return async function(ctx, next, ...args) {
			if (ctx.method === method) {
				let pathMatched = matchPath(ctx.path);
				if (pathMatched) {
					ctx.params = pathMatched.params;
					await callback.call(this, ctx, next, ...args);
					return;
				}
			}
			await next();
		};
	};
});

module.exports = KoaRoute;
