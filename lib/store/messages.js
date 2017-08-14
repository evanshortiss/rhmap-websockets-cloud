'use strict';

const Promise = require('bluebird');
const db = Promise.promisify(require('fh-mbaas-api').db);
const log = require('fh-bunyan').getLogger('message-collection');
const omit = require('lodash').omit;

const TYPE = 'messages';

/**
 * Write a message to the application database
 * @param {Object} message
 */
exports.storeMessage = function (message) {
  log.trace('storing message %j', message);

  // Insert timestamp the server received this message into the object
  const fields = Object.assign({}, message, { recvTs: new Date() });

  return db({
    type: TYPE,
    fields: fields,
    act: 'create'
  })
    .thenReturn(fields);
};


/**
 * Fetches the last 20 messages from the database
 * @return {Promise<Array>}
 */
exports.getRecentMessages = function () {
  log.trace('performing db read for recent messages');

  return db({
    type: TYPE,
    act: 'list',
    limit: 20
  })
    // Return messages without leaking user device ids
    .then((ret) => ret.list.map((entry) => omit(entry.fields, 'deviceId')));
};
