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

  it('test type string', () => {
    return app.httpRequest()
      .get('/?ss=some')
      .expect('[{"message":"name 必填","field":"name"}]')
      .expect(400);
  });

  it('test type object', () => {
    return app.httpRequest()
      .get('/a?ss=some')
      .expect('[{"message":"name 必填","field":"name"}]')
      .expect(400);
  });

  it('test type async function', () => {
    return app.httpRequest()
      .get('/b?name=some')
      .expect('hi, validator')
      .expect(200);
  });

  it('test type rules function js', () => {
    return app.httpRequest()
      .get('/d?name=some')
      .expect('[{"field":"name","message":"错误"}]')
      .expect(400);
  });

  it('test type rules function by yaml', () => {
    return app.httpRequest()
      .get('/f?name=some')
      .expect('[{"field":"name","message":"错误"}]')
      .expect(400);
  });
});
