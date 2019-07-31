'use strict';
const depd = require('depd')('egg-y-validator');

module.exports = options => {
  return async (ctx, next) => {
    if (options.formatter || options.formate) {
      let fn = options.formatter;
      if (options.formate) {
        depd(
          'config.formate is deprecated. now you can use config.formatter replace.'
        );
        fn = options.formate;
      }
      try {
        return await next();
      } catch (e) {
        return await fn(ctx, e);
      }
    }
    return next();
  };
};
