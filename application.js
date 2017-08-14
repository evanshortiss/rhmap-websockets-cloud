'use strict';

const log = require('fh-bunyan').getLogger('application');

try {
  // Load env from .env file - file is in the gitignore so this only works locally
  require('dotenv').config();
  log.warn('loaded vars from .env file - should only happen locally');
} catch (e) {
  log.warn('failed to load env vars from .env file - this can be ignored if deployed in rhmap');
}

const Promise = require('bluebird');
const http = require('http');
const mbaasApi = require('fh-mbaas-api');
const express = require('express');
const io = require('lib/sockets');
const sync = require('lib/sync');
const mbaasExpress = mbaasApi.mbaasExpress();

// The express application - we pass this to the http.Server
const app = express();

// Create a regular http.Server for socket.io to intercept connections
const server = http.Server(app);

log.info('performing startup tasks');

Promise.resolve()
  .then(() => io.init(server)) // initialise socket.io with our http.Server
  .then(() => sync.init())     // we'll use sync framework for user configs
  .then(startServer);          // start the express application

function startServer () {
  // Enable CORS for all requests
  app.use(require('cors')());

  // Note: the order which we add middleware to Express here is important!
  app.use('/sys', mbaasExpress.sys([]));
  app.use('/mbaas', mbaasExpress.mbaas);

  // Note: important that this is added just before your own Routes
  app.use(mbaasExpress.fhmiddleware());

  // Important that this is last as per express conventions!
  app.use(mbaasExpress.errorHandler());

  const port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
  const host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

  server.listen(port, host, undefined, () => {
    log.info(`application started on ${host}:${port}`);
  });
}
