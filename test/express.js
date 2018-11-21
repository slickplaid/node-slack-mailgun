/* eslint-env node, mocha */
/* global it:false */

const { expect } = require('./helper');

var express = require('express');
var bodyParser = require('body-parser');
var superagent = require('superagent');
var SlackGun = require('../index');
var crypto = require('crypto');
var fixtures = require('./fixtures');

var app2 = express();

app2.use('/api/mailgun', bodyParser.json(), SlackGun({
  slack: { hook: 'http://localhost:4446/' }
}));

var app = express();

app.use('/api/mailgun', bodyParser.json(), SlackGun({
  slack: { hook: 'http://localhost:4446/' },
  mailgun: { apikey: '123' }
}));

var server, server2;

before(function() {
  server = app.listen(4448);
  server2 = app2.listen(4447);
});

after(function() {
  server.close();
  server2.close();
});

var slackTest = express();
slackTest.use(bodyParser.urlencoded());
var slackServer;

describe('Express', function() {

  describe('Mailgun Validation', function() {
    it('accept express POST with mailgun API key for signature validation', function(done) {
      var token = 'abc';
      var timestamp = Date.now();
      var data = [timestamp, token].join('');
      var hmac = crypto.createHmac('sha256', '123').update(data);
      var signature = hmac.digest('hex');

      superagent
        .post('http://localhost:4448/api/mailgun')
        .set('Content-Type', 'application/json')
        .send({
          signature: {
            timestamp: timestamp,
            token: token,
            signature: signature,
          },
          'event-data': fixtures.events.delivered['event-data'],
        })
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.statusCode).to.equal(200);
          done(err);
        });
    });

    it('Invalid token should error', function(done) {
      var token = 'abc';
      var timestamp = Date.now();
      var data = [timestamp + token].join();
      var hmac = crypto.createHmac('sha256', '1234').update(data);
      var signature = hmac.digest('hex');

      superagent
        .post('http://localhost:4448/api/mailgun')
        .set('Content-Type', 'application/json')
        .send({
          signature: {
            timestamp: timestamp,
            token: token,
            signature: signature,
          },
          'event-data': fixtures.events.delivered['event-data'],
        })
        .end(function(err) {
          expect(err).to.exist;
          expect(err.status).to.equal(406);
          done();
        });
    });

    it('accept express POST without mailgun API key for signature validation', function(done) {
      var token = 'abc';
      var timestamp = Date.now();
      var data = [timestamp + token].join();
      var hmac = crypto.createHmac('sha256', '123').update(data);
      var signature = hmac.digest('hex');

      superagent
        .post('http://localhost:4447/api/mailgun')
        .send({
          signature: {
            timestamp: timestamp,
            token: token,
            signature: signature,
          },
          'event-data': fixtures.events.delivered['event-data'],
        })
        .end(function(err) {
          done(err);
        });
    });
  });

  describe('Slack', function() {
    before(function() {
      slackServer = slackTest.listen(4446);
    });

    it('Slack should get a message', function(done) {
      slackTest.post('/', function(req, res) {
        res.status(200).send('ok');
        done();
      });

      var token = 'abc';
      var timestamp = Date.now();
      var data = [timestamp + token].join();
      var hmac = crypto.createHmac('sha256', '123').update(data);
      var signature = hmac.digest('hex');

      superagent
        .post('http://localhost:4448/api/mailgun')
        .set('Content-Type', 'application/json')
        .send({
          'signature': {
            'timestamp': timestamp,
            'token': token,
            'signature': signature,
          },
          'event-data': fixtures.events.delivered['event-data'],
        })
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.statusCode).to.equal(200);
        });
    });

    after(function() {
      slackServer.close();
    });
  });
});