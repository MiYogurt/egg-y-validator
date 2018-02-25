# egg-y-validator

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]
![](https://img.shields.io/badge/license-MIT-000000.svg)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FMiYogurt%2Fegg-y-validator.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FMiYogurt%2Fegg-y-validator?ref=badge_shield)


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
  async formatter(ctx, error) {
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

all rules you can find in [async-validator](https://github.com/yiminghe/async-validator/blob/e782748f0345b462d84e96a582c0dd38db2de666/__tests__/deep.spec.js)

```yaml
name:
  type: 'string'
  required: true
```

if you want custom rules，and get context ，but only support js、yal file

```js
/* eslint-disable */
'use strict';

module.exports = {
  name: [
    {
      required: true,
    }, {
      validator: ctx => async (rule, value, callback, source, options) => {
        // console.log(ctx);
        // console.log(rule);
        // { validator: [Function],
        // field: 'name',
        // fullField: 'name',
        // type: 'string' }
        // console.log(value);
        // some
        // console.log(source);
        // { name: 'some' }
        // console.log(options);
        // { messages:
        // { default: 'Validation error on field %s',
        //   required: '%s 必填',
        //   enum: '%s must be one of %s',
        //   whitespace: '%s cannot be empty',
        //   date:
        //    { format: '%s date %s is invalid for format %s',
        //      parse: '%s date could not be parsed, %s is invalid ',
        //      invalid: '%s date %s is invalid' },
        //   types:
        //    { string: '%s is not a %s',
        //      method: '%s is not a %s (function)',
        //      array: '%s is not an %s',
        //      object: '%s is not an %s',
        //      number: '%s is not a %s',
        //      date: '%s is not a %s',
        //      boolean: '%s is not a %s',
        //      integer: '%s is not an %s',
        //      float: '%s is not a %s',
        //      regexp: '%s is not a valid %s',
        //      email: '%s is not a valid %s',
        //      url: '%s is not a valid %s',
        //      hex: '%s is not a valid %s' },
        //   string:
        //    { len: '%s must be exactly %s characters',
        //      min: '%s must be at least %s characters',
        //      max: '%s cannot be longer than %s characters',
        //      range: '%s must be between %s and %s characters' },
        //   number:
        //    { len: '%s must equal %s',
        //      min: '%s cannot be less than %s',
        //      max: '%s cannot be greater than %s',
        //      range: '%s must be between %s and %s' },
        //   array:
        //    { len: '%s must be exactly %s in length',
        //      min: '%s cannot be less than %s in length',
        //      max: '%s cannot be greater than %s in length',
        //      range: '%s must be between %s and %s in length' },
        //   pattern: { mismatch: '%s value %s does not match pattern %s' },
        //   clone: [Function: clone] } }
        throw [{field:'name', message:'错误'}]
      },
    }],
};
```

```yml
name:
  - 
    required: true
  - 
    validator: !!js/function >
      function validator(ctx) {
        return async function (rule, value, callback, source, options) {
          throw [{field:'name', message:'错误'}]
        }
      }

```

throw error you can use throw or callback

## Verify on your controller

```js
'use strict'

const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const query = await this.ctx.verify('login.login', 'query')
    this.ctx.body = 'hi, ' + this.app.plugins.validator.name
  }
}

module.exports = HomeController
```

## api

### ctx.verify(path, type)

* path
  * `login.login` -> 'app/schemas/login/login.{json/js/toml/yaml}'
  * `login` -> if login has index propety -> `login.index` -> 'app/schemas/login/index.{json/js/toml/yaml}'
  * if path type is object use the object
* type
  * query -> ctx.request.query
  * body -> ctx.request.body
  * params -> ctx.params
  * undefined -> R.merge(this.params, this.request.query, this.request.body)
  * object -> object
  * async function -> will be invoke

### ctx.doc

all validator rules

### ctx.loadDocs(reload)

* reload -> boolean true will reload rules file

## Questions & Suggestions

Please open an issue [here](https://github.com/MiYogurt/egg-y-validator/issues).

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FMiYogurt%2Fegg-y-validator.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FMiYogurt%2Fegg-y-validator?ref=badge_large)

