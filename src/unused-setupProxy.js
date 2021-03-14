const { createProxyMiddleware } = require('http-proxy-middleware');

const mangadexOptions = {
  target: 'https://api.mangadex.org/v2',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  }
};

const mangadbOptions = {
  target: 'http://localhost:5000',
  changeOrigin: true
};

module.exports = (app) => {
  app.use('/api', createProxyMiddleware(mangadexOptions));
  app.use('/mangadb', createProxyMiddleware(mangadbOptions));
};