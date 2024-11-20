const express = require('express');
const { createProxyServer } = require('http-proxy');

const app = express();
const proxy = createProxyServer();
const proxyOrigin = process.env.PROXY_ORIGIN;

app.use((req, res) => {
	proxy.web(req, res, {
		target: proxyOrigin,
		changeOrigin: true
	});
});

module.exports = app;
