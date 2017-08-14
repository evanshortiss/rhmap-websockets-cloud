'use strict';

const messageStore = require('../store/messages');
const MESSAGES_TYPES = require('./message-types');
const log = require('fh-bunyan').getLogger('message-handlers');
const Joi = require('joi');
const omit = require('lodash').omit;

// Used to validate incoming message structures
const messageSchema = Joi.object({
  deviceId: Joi.string().required(),
  text: Joi.string().required(),
  firstname: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
  ts: Joi.date().iso().required()
});

module.exports = function getMessageHandlers (sock) {

  return {
    /**
     * Upon receiving a message we store it in the database and then propogate
     * it to other clients.
     * @param {Object} data
     */
    onMessageReceived: (data) => {
      log.debug('validating message received from client %j', data);

      Joi.validate(data, messageSchema, (err) => {
        if (err) {
          // Message structure was invalid - return an error to the client
          log.warn('client send invalid message "%s" - %j', err.toString(), data);
          sock.emit(MESSAGES_TYPES.MESSAGE.INVALID_FORMAT, {
            err: err.toString()
          });
        } else {
          // Was a valid message - save it and propogate to all connections
          log.debug('valid message received from client %j', data);
          messageStore.storeMessage(data)
            .then(() => {
              const payload = omit(data, 'deviceId'); // don't share device ids

              log.debug('message saved, propogate to others as %j', payload);

              sock.broadcast.emit(MESSAGES_TYPES.MESSAGE.SEND, payload);
            });
        }
      });
    }
  };
};
