# egg-y-validator

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-y-validator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-y-validator
[travis-image]: https://img.shields.io/travis/eggjs/egg-y-validator.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-y-validator
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-y-validator.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-y-validator?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-y-validator.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-y-validator
[snyk-image]: https://snyk.io/test/npm/egg-y-validator/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-y-validator
[download-image]: https://img.shields.io/npm/dm/egg-y-validator.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-y-validator

<!--
Description here.
-->

## Install

```bash
$ npm i egg-y-validator --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.yValidator = {
  enable: true,
  package: 'egg-y-validator',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.yValidator = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
