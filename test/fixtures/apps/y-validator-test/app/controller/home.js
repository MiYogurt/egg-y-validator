'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    console.log('context');
    console.log(this.app.schames);
    this.ctx.body = 'hi, ' + this.app.plugins.validator.name;
  }
}

module.exports = HomeController;
