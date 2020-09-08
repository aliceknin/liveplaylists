const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy(
    '/proof',
    {
        target: 'http://localhost:4000'
    }
  ));
  app.use(proxy(
    '/auth',
    {
      target: 'http://localhost:4000'
    }
  ));
  app.use(proxy(
    '/spotify',
    {
      target: 'http://localhost:4000'
    }
  ));
  app.use(proxy(
    '/playlist',
    {
      target: 'http://localhost:4000'
    }
  ));
};