# egg-y-validator

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-y-validator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-y-validator
[travis-image]: https://img.shields.io/travis/MiYogurt/egg-y-validator.svg?style=flat-square
[travis-url]: https://travis-ci.org/MiYogurt/egg-y-validator
[codecov-image]: https://img.shields.io/codecov/c/github/MiYogurt/egg-y-validator.svg?style=flat-square
[codecov-url]: https://codecov.io/github/MiYogurt/egg-y-validator?branch=master
[david-image]: https://img.shields.io/david/MiYogurt/egg-y-validator.svg?style=flat-square
[david-url]: https://david-dm.org/MiYogurt/egg-y-validator
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
exports.validator = {
  enable: true,
  package: 'egg-y-validator'
}
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.validator = {
  open: async ctx => 'zh-CN',
  // or
  // open: 'zh-CN',
  languages: {
    'zh-CN': {
      required: '%s 必填'
    }
  },
  async formate(ctx, error) {
    ctx.type = 'json'
    ctx.status = 400
    ctx.body = error
  }
}
```

see [config/config.default.js](config/config.default.js) for more detail.

## Create rules

`app/schemas/login/login.yml`

Suport json、js、yaml、toml file.

```yaml
name:
  type: 'string'
  required: true
```

## Verify on your controller

```js
'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    await this.ctx.verify('login.login', 'query')
    this.ctx.body = 'hi, ' + this.app.plugins.validator.name
  }
}

module.exports = HomeController
```

## api

### ctx.verify(path, type)

* path
  * `login.login` -> 'app/schemas/login/login.{json/js/toml/yaml}'
* type
  * query -> ctx.request.query
  * body -> ctx.request.body
  * params -> ctx.params
  * undefined -> R.merge(this.params, this.request.query, this.request.body)

### ctx.doc

all validator rules

### ctx.loadDocs(reload)

* reload -> boolean true will reload rules file

## Questions & Suggestions

Please open an issue [here](https://github.com/MiYogurt/egg-y-validator/issues).

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FMiYogurt%2Fegg-y-validator.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FMiYogurt%2Fegg-y-validator?ref=badge_large)

[MIT](LICENSE)
