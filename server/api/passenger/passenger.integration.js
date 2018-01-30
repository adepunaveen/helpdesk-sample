'use strict';

var app = require('../..');
import request from 'supertest';

var newPassenger;

describe('Passenger API:', function() {

  describe('GET /api/passengers', function() {
    var passengers;

    beforeEach(function(done) {
      request(app)
        .get('/api/passengers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          passengers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      passengers.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/passengers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/passengers')
        .send({
          name: 'New Passenger',
          info: 'This is the brand new passenger!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newPassenger = res.body;
          done();
        });
    });

    it('should respond with the newly created passenger', function() {
      newPassenger.name.should.equal('New Passenger');
      newPassenger.info.should.equal('This is the brand new passenger!!!');
    });

  });

  describe('GET /api/passengers/:id', function() {
    var passenger;

    beforeEach(function(done) {
      request(app)
        .get('/api/passengers/' + newPassenger._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          passenger = res.body;
          done();
        });
    });

    afterEach(function() {
      passenger = {};
    });

    it('should respond with the requested passenger', function() {
      passenger.name.should.equal('New Passenger');
      passenger.info.should.equal('This is the brand new passenger!!!');
    });

  });

  describe('PUT /api/passengers/:id', function() {
    var updatedPassenger;

    beforeEach(function(done) {
      request(app)
        .put('/api/passengers/' + newPassenger._id)
        .send({
          name: 'Updated Passenger',
          info: 'This is the updated passenger!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedPassenger = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedPassenger = {};
    });

    it('should respond with the updated passenger', function() {
      updatedPassenger.name.should.equal('Updated Passenger');
      updatedPassenger.info.should.equal('This is the updated passenger!!!');
    });

  });

  describe('DELETE /api/passengers/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/passengers/' + newPassenger._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when passenger does not exist', function(done) {
      request(app)
        .delete('/api/passengers/' + newPassenger._id)
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
