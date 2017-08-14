'use strict';

const sync = require('fh-mbaas-api').sync;
const env = require('env-var');

/**
 * Initialise sync datasets. Currently just settings
 * @return {Promise<undefined>}
 */
exports.init = function () {
  return new Promise((resolve, reject) => {
    sync.init('user-settings', {
      sync_frequency: env('CHAT_USER_SETTING_FREQ', 30).asPositiveInt()
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
