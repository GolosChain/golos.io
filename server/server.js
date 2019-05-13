const express = require('express');
const cookieParser = require('cookie-parser');
const next = require('next');
const uuid = require('uuid/v4');
const path = require('path');

const sentry = require('../src/shared/sentry');
const routes = require('../src/shared/routes');

const port = parseInt(process.env.PORT, 10) || 3000;

const sourcemapsForSentryOnly = (req, res, next) => {
  // In production we only want to serve source maps for sentry
  const token = process.env.SENTRY_TOKEN;

  if (!token) {
    console.warn('Accessing to sourcemaps is rejected. SENTRY_TOKEN env have to be set');
    res.status(404).send('Resource is not found');
    return;
  }

  if (!req.headers['x-sentry-token'] !== token) {
    res.status(401).send('Authentication access token is required to access the source map.');
    return;
  }

  next();
};

const app = next({
  dev: process.env.NODE_ENV !== 'production',
  dir: path.resolve(__dirname, '../src'),
});

const handler = routes.getRequestHandler(app);

function sessionCookie(req, res, next) {
  const isHtmlPage =
    !/^\/(?:_next|static)/.test(req.path) &&
    !/\.(?:js|map)$/.test(req.path) &&
    req.accepts('text/html') === 'text/html';

  if (!isHtmlPage) {
    next();
    return;
  }

  if (!req.cookies.sid) {
    const sid = uuid();

    req.cookies.sid = sid;
    res.cookie('sid', sid);
  }

  next();
}

app.prepare().then(() => {
  const { Sentry } = sentry(app.buildId);

  const server = express();

  server.use(Sentry.Handlers.requestHandler());
  server.use(cookieParser());
  server.use(sessionCookie);
  if (process.env.NODE_ENV === 'production') {
    server.get(/\.map$/, sourcemapsForSentryOnly);
  }
  server.use(express.static(path.join(__dirname, '../src/static')));
  server.use(handler);
  server.use(Sentry.Handlers.errorHandler());

  server.listen(port, err => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
  });
});
