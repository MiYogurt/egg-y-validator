'use strict';
const Validate = require('async-validator');
const { resolve, sep: s } = require('path');
const glob = require('fast-glob');
const mi = require('m-import').default;
const R = require('ramda');
const camelCase = require('camelcase');

const debug = require('debug')('egg-y-validator');

const CACHE = Symbol.for('egg-y-validator');
const VALIDATOR = Symbol.for('egg-y-validator:getValidator');
const GETFIELD = Symbol.for('egg-y-validator:getField');

const { assocPath, compose, curry } = R;

const delStr = curry((delStr, souStr) => {
  if (Array.isArray(delStr)) {
    return delStr.reduce((prev, current) => prev.replace(current, ''), souStr);
  }
  return souStr.replace(delStr, '');
});
//* 对所有的函数传递 ctx
const invokeFn = (obj, ctx) => {
  const forEach = (value, index) => {
    if (R.type(value) === 'Array') {
      invokeFn(value, ctx);
    }
    if (R.type(value) === 'Object' && R.has('validator', value)) {
      value.validator = value.validator(ctx);
    }
    if (index === 'validator') {
      obj[index] = obj[index](ctx);
    }
  };
  if (R.type(obj) === 'Array') {
    R.forEach(forEach, obj);
  }
  if (R.type(obj) === 'Object') {
    R.forEachObjIndexed(forEach, obj);
  }
};

module.exports = {
  loadDocs(reload) {
    if (!reload && this[CACHE]) {
      return this[CACHE];
    }
    const { app } = this;
    let schemas = {};

    const matchPath = resolve(app.config.baseDir, 'app', 'schemas', '**', '*');
    const paths = glob.sync(matchPath);

    const delAllStr = compose(
      delStr(['.json', '.js', '.toml', '.tml', '.yaml', '.yml']),
      delStr(app.config.baseDir + `${s}app${s}schemas${s}`)
    );

    const ForEach = R.tryCatch(path => {
      const content = mi(path);
      path = delAllStr(path).split(s);
      this[CACHE] = schemas = assocPath(
        path.map(p => camelCase(p)),
        content,
        schemas
      );
    }, console.error);

    paths.forEach(ForEach);
    return schemas;
  },

  get docs() {
    return this.loadDocs(false);
  },
  //* 需要验证的对象
  async [GETFIELD](type) {
    if (compose(R.equals('AsyncFunction'), R.type)(type)) {
      return await type();
    }
    return R.cond([
      [compose(R.equals('Object'), R.type), R.always(type)],
      [compose(R.equals('Function'), R.type), type],
      [R.equals('query'), R.always(this.request.query)],
      [R.equals('body'), R.always(this.request.body)],
      [R.equals('params'), R.always(this.params)],
      [
        R.T,
        R.always(R.merge(this.params, this.request.query, this.request.body))
      ]
    ])(type);
  },
  //* 拿到验证规则
  getValidatorRules(path) {
    let rules;
    if (R.type(path) === 'Object') {
      rules = path;
    } else {
      path = path.split('.');
      rules = R.path(path, this.docs);
      rules = R.defaultTo(rules, R.prop('index', rules));
      invokeFn(rules, this);
    }
    return rules;
  },
  //* 拿到验证器
  async [VALIDATOR](config) {
    if (this.app.config.validator.superstruct) {
      const { superstruct } = require('superstruct');
      const types = R.defaultTo({}, this.app.config.validator.types(this));
      const struct = superstruct({
        types: R.merge(types, config.types)
      });
      delete config.types;
      const validator = struct(config);
      // 保证跟 async-validator 相同的 API
      return {
        validate: (fields, fn) => {
          try {
            fn(null, validator(fields));
          } catch (e) {
            fn(e);
          }
        }
      };
    }
    let open = this.app.config.validator.open;
    if (R.type(open) === 'Function' || R.type(open) === 'AsyncFunction') {
      open = await open(this);
    }
    const messages = this.app.config.validator.languages[open] || {};
    const validator = new Validate(config);
    validator.messages(messages);
    return validator;
  },
  async verify(path, type) {
    const rules = this.getValidatorRules(path);
    const validator = await this[VALIDATOR](rules);
    const fields = await this[GETFIELD](type);
    debug('rules %j', rules);
    debug('fields %o', fields);
    return new Promise((resolve, reject) => {
      validator.validate(fields, errors => {
        if (errors) {
          reject(errors);
        }
        resolve(fields);
      });
    });
  }
};
