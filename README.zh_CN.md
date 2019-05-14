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

## 安装

```bash
$ npm i egg-y-validator --save
```

## 使用

```js
// {app_root}/config/plugin.js
exports.validator = {
  enable: true,
  package: 'egg-y-validator'
};
```

## 配置

```js
// {app_root}/config/config.default.js
exports.validator = {
  open: async ctx => 'zh-CN',
  // or
  // open: 'zh-CN',  它表示开启的语言
  languages: {
    'zh-CN': {
      required: '%s 必填'
    }
  },
  async formatter(ctx, error) {
    ctx.type = 'json';
    ctx.status = 400;
    ctx.body = error;
  }
};
```

看 [config/config.default.js](config/config.default.js) 可以看到更多配置.

## 创建

`app/schemas/login/login.yml`

Suport json、js、yaml、toml file.

所有的规则你可以在这里找到 [async-validator](https://github.com/yiminghe/async-validator/blob/e782748f0345b462d84e96a582c0dd38db2de666/__tests__/deep.spec.js)

```yaml
name:
  type: 'string'
  required: true
```

假如你想自定义，写高阶函数，获取到 context，仅支持 yaml 和 js 格式。

```js
/* eslint-disable */
'use strict';

module.exports = {
  name: [
    {
      required: true
    },
    {
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
        throw [{ field: 'name', message: '错误' }];
      }
    }
  ]
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

抛出错误使用 throw 抛出，或者 callback 方法

## 在你的控制器里面 调用 verify 验证

```js
'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const query = await this.ctx.verify('login.login', 'query');
    this.ctx.body = 'hi, ' + this.app.plugins.validator.name;
  }
}

module.exports = HomeController;
```

##  接口

### ctx.verify(path, type)

* path 验证的规则
  * `login.login` -> 'app/schemas/login/login.{json/js/toml/yaml}'
  * `login` -> 假如这个 login 下面有 index -> `login.index` -> 'app/schemas/login/index.{json/js/toml/yaml}'
  * 假如 path 是一个 object 会直接使用这个 object
* type 验证的对象
  * query -> ctx.request.query
  * body -> ctx.request.body
  * params -> ctx.params
  * undefined -> R.merge(this.params, this.request.query, this.request.body) // 不传会自动 merge 这几个对象
  * object -> object
  * async function -> // 会调用你的 async 方法获取

### ctx.docs

所有的规则在这里

### ctx.loadDocs(reload)

* reload -> boolean 里面有 cache 当 reload 为 true 才会重新加载

## Questions & Suggestions

Please open an issue [here](https://github.com/MiYogurt/egg-y-validator/issues).

## 支持 superstruct 库

but superstruct custom type function not support async function

但是这个库不支持 async fucction

[superstruct api](https://github.com/ianstormtaylor/superstruct/blob/master/docs/reference.md#types)

more info you can see the test file example.

### config.default.js

```js
exports.validator = {
  superstruct: true,
  types(ctx) {
    // 自定义你的类型 不支持 async function
    return {
      email: v => true
    };
  },
  async formatter(ctx, error) {
    const { data, path, value } = error;
    console.log(error);
    ctx.type = 'json';
    ctx.status = 400;
    ctx.body = { field: path[0], message: '无效的值' };
    console.log(ctx.body);
  }
};
```

### controller

```js
  async b() {
    const ret = await this.ctx.verify(
      { // 规则
        name: 'string'
      },
      async () => { // 数据
        return this.ctx.query;
      }
    );
    this.ctx.body = 'hi, ' + this.app.plugins.validator.name;
  }
  async d() {
    await this.ctx.verify('haha', async () => {
      return { name: '123', email: 'ck123.com' };
    });
    this.ctx.body = 'hi, ' + this.app.plugins.validator.name;
  }
```

### rules

验证规则的写法

```js
module.exports = {
  name: 'string',
  email: 'email',
  types: {
    email: v => {
      console.log('email verify');
      return Boolean(v.indexOf('@') != -1);
    }
  }
};
```

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FMiYogurt%2Fegg-y-validator.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FMiYogurt%2Fegg-y-validator?ref=badge_large)
