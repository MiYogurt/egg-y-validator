'use strict';
const Validate = require('async-validator');
const { resolve } = require('path');
const glob = require('globby');
const mi = require('m-import').default;
const R = require('ramda');
const camelCase = require('camelcase');

const CACHE = Symbol.for('egg-y-validator');

const { assocPath, compose, curry } = R;

const delStr = curry((delStr, souStr) => {
  if (Array.isArray(delStr)) {
    return delStr.reduce((prev, current) => prev.replace(current, ''), souStr);
  }
  return souStr.replace(delStr, '');
});

module.exports = {
  loadDocs(reload) {
    if (!reload && this[CACHE]) {
      return this[CACHE];
    }
    const { app } = this;
    let schemas = {};

    const matchPath = resolve(app.config.baseDir, 'app', 'schemas');
    const paths = glob.sync(matchPath + '/**/*');

    const delAllStr = compose(
      delStr([ '.json', '.js', '.toml', '.tml', '.yaml', '.yml' ]),
      delStr(app.config.baseDir + '/app/schemas/')
    );

    const ForEach = R.tryCatch(path => {
      const content = mi(path);
      path = delAllStr(path).split('/');
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

  async verify(path, type) {
    let open = this.app.config.validator.open;
    if (R.type(open) === 'Function') open = await open(this);
    const messages = this.app.config.validator.languages[open] || {};

    let rules;

    const findFunc = obj => {

      const forEach = (value, index) => {
        if (R.type(value) === 'Array') {
          findFunc(value);
        }
        if (R.type(value) === 'Object' && R.has('validator', value)) {
          value.validator = value.validator(this);
        }
        if (index === 'validator') {
          obj[index] = obj[index](this);
        }
      };
      if (R.type(obj) === 'Array') {
        R.forEach(forEach, obj);
      }
      if (R.type(obj) === 'Object') {
        R.forEachObjIndexed(forEach, obj);
      }
    };

    if (R.type(path) === 'Object') {
      rules = path;
    } else {
      path = path.split('.');
      rules = R.path(path, this.docs);
      rules = R.defaultTo(rules, R.prop('index', rules));
      findFunc(rules);
    }


    const validator = new Validate(rules);
    validator.messages(messages);

    const fields = await R.cond([
      [ compose(R.equals('Object'), R.type), R.always(type) ],
      [ compose(R.equals('Function'), R.type), type ],
      [ R.equals('query'), R.always(this.request.query) ],
      [ R.equals('body'), R.always(this.request.body) ],
      [ R.equals('params'), R.always(this.params) ],
      [
        R.T,
        R.always(R.merge(this.params, this.request.query, this.request.body)),
      ],
    ])(type);

    return new Promise((resolve, reject) => {
      validator.validate(fields, errors => {
        if (errors) {
          reject(errors);
        }
        resolve(fields);
      });
    });
  },
};
