'use strict';

module.exports = app => {
  require('./lib/loader')(app);
  app.config.appMiddlewares.push('validator');
};
