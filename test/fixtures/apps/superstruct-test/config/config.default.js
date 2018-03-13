'use strict';

exports.keys = '123456';
exports.validator = {
  superstruct: true,
  types(ctx) {
    return {
      email: v => true
    };
  },
  async formatter(ctx, error) {
    const { data, path, value } = error;
    ctx.type = 'json';
    ctx.status = 400;
    ctx.body = { field: path[0], message: '无效的值' };
  }
};
