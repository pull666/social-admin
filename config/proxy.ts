export default {
  dev: {
    '/api/': {
      target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:3000',
      changeOrigin: true,
    },
  },
};
