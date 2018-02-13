'use strict';

/**
 * egg-y-validator default config
 * @member Config#validator
 * @property {String} SOME_KEY - some description
 */
exports.validator = {
  open: 'zh-CN',
  languages: {
    'zh-CN': {
      required: '%s 必填',
    },
  },
  async formate(ctx, error) {
    ctx.type = 'json';
    ctx.status = 400;
    ctx.body = error;
  },
};
