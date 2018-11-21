
/*!
 * mailgun-verify
 * Copyright(c) 2015 Slick Labs, LLC
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var crypto = require('crypto');

/**
 * Module exports.
 */

module.exports = verifyMailgun;

/**
 * Verify mailgun HMAC authentication token
 */

function verifyMailgun(apikey, token, timestamp, signature) {
  var data = [timestamp, token].join('');
  var hmac = crypto.createHmac('sha256', apikey).update(data);
  var ourSig = hmac.digest('hex');

  var output = {
    apikey: apikey,
    token: token,
    timestamp: timestamp,
    signature: signature,
    generatedSignature: ourSig,
    valid: ourSig === signature
  };

  return output;
}

/**
 * TODO - Reply attack cache check
 */
// eslint-disable-next-line
function replayAttackCache() {
  this.tokens = [];
}
