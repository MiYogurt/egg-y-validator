'use strict';
const { resolve } = require('path');
const glob = require('globby');
const mi = require('m-import').default;
const R = require('ramda');
const camelCase = require('camelcase');

const { assocPath, compose, curry } = R;

const delStr = curry((delStr, souStr) => {
  if (Array.isArray(delStr)) {
    return delStr.reduce((prev, current) => prev.replace(current, ''), souStr);
  }
  return souStr.replace(delStr, '');
});

module.exports = app => {

  const matchPath = resolve(app.config.baseDir, 'app', 'schemas');
  const paths = glob.sync(matchPath + '/**/*');

  const delAllStr = compose(
    delStr([
      '.js',
      '.json',
      '.toml',
      '.tml',
      '.yaml',
      '.yml',
    ]),
    delStr(app.config.baseDir + '/app/schemas/')
  );

  const ForEach = R.tryCatch(path => {
    const content = mi(path);
    path = delAllStr(path).split('/');
    app.schemas = assocPath(path.map(p => camelCase(p)), content, app.schemas);
  }, console.error);

  paths.forEach(ForEach);
  console.log(app.schemas);
};
