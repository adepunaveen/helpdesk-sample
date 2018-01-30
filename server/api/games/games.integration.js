'use strict';

var app = require('../..');
import request from 'supertest';

var newGames;

describe('Games API:', function() {

  describe('GET /api/gamess', function() {
    var gamess;

    beforeEach(function(done) {
      request(app)
        .get('/api/gamess')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          gamess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      gamess.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/gamess', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/gamess')
        .send({
          name: 'New Games',
          info: 'This is the brand new games!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newGames = res.body;
          done();
        });
    });

    it('should respond with the newly created games', function() {
      newGames.name.should.equal('New Games');
      newGames.info.should.equal('This is the brand new games!!!');
    });

  });

  describe('GET /api/gamess/:id', function() {
    var games;

    beforeEach(function(done) {
      request(app)
        .get('/api/gamess/' + newGames._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          games = res.body;
          done();
        });
    });

    afterEach(function() {
      games = {};
    });

    it('should respond with the requested games', function() {
      games.name.should.equal('New Games');
      games.info.should.equal('This is the brand new games!!!');
    });

  });

  describe('PUT /api/gamess/:id', function() {
    var updatedGames;

    beforeEach(function(done) {
      request(app)
        .put('/api/gamess/' + newGames._id)
        .send({
          name: 'Updated Games',
          info: 'This is the updated games!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedGames = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGames = {};
    });

    it('should respond with the updated games', function() {
      updatedGames.name.should.equal('Updated Games');
      updatedGames.info.should.equal('This is the updated games!!!');
    });

  });

  describe('DELETE /api/gamess/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/gamess/' + newGames._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when games does not exist', function(done) {
      request(app)
        .delete('/api/gamess/' + newGames._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
