'use strict';

exports.keys = '123456';
exports.validator = {
  open: 'zh-CN',
  languages: {
    'zh-CN': {
      required: '%s 必填',
    },
  },
  async formatter(ctx, error) {
    ctx.type = 'json';
    ctx.status = 400;
    ctx.body = error;
  },
};
