'use strict';

module.exports = options => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      return await options.formate(ctx, e);
    }
  };
};
