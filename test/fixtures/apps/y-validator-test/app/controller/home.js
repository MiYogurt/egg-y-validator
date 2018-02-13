'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.verify('login.login', 'query');
    this.ctx.body = 'hi, ' + this.app.plugins.validator.name;
  }
}

module.exports = HomeController;
