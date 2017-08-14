'use strict';

const log = require('fh-bunyan').getLogger('sockets');
const MESSAGE_TYPES = require('./message-types');
const messageStore = require('../store/messages');

/**
 * Initialises a socket server by attaching it to our express application
 * @param {http.Server}
 */
exports.init = function (s) {
  const io = require('socket.io')(s);
  const nsp = io.of('/chat');

  log.info('initialising socket.io server');

  // detect connections to our chat namepsace and initialise with events
  nsp.on('connection', (sock) => {
    const handlers = require('./message-handlers')(sock);

    log.info('new client connected. binding events');

    sock.on('disconnect', () => log.info('client disconneted'));
    sock.on(MESSAGE_TYPES.MESSAGE.SEND, (msg) => handlers.onMessageReceived(msg));

    // When a client connects we want to echo back the most recent messages
    messageStore.getRecentMessages()
      .tap((list) => log.trace('loaded recent messages for connected client %j', list))
      .then((list) => sock.emit(MESSAGE_TYPES.MESSAGE.LIST, list));
  });
};


