'use strict';

const mock = require('egg-mock');

describe('test/y-validator.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/y-validator-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/?ss=some')
      .expect('[{"message":"name 必填","field":"name"}]')
      .expect(400);
  });
});
