'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/a', controller.home.a);
  router.get('/b', controller.home.b);
};
