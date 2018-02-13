'use strict';

module.exports = app => {
  app.config.appMiddlewares.push('validator');
};
