const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // '/api/auth'로 시작하는 요청은 인증 서버로 보냅니다.
  app.use(
    "/api/auth",
    createProxyMiddleware({
      target: "https://auth.youth-fi.com",
      changeOrigin: true,
    })
  );

  // '/api/finproduct'로 시작하는 요청은 금융상품 서버로 보냅니다.
  app.use(
    "/api/finproduct",
    createProxyMiddleware({
      target: "https://policy.youth-fi.com",
      changeOrigin: true,
    })
  );
};
