'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var passengerCtrlStub = {
  index: 'passengerCtrl.index',
  show: 'passengerCtrl.show',
  create: 'passengerCtrl.create',
  update: 'passengerCtrl.update',
  destroy: 'passengerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var passengerIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './passenger.controller': passengerCtrlStub
});

describe('Passenger API Router:', function() {

  it('should return an express router instance', function() {
    passengerIndex.should.equal(routerStub);
  });

  describe('GET /api/passengers', function() {

    it('should route to passenger.controller.index', function() {
      routerStub.get
        .withArgs('/', 'passengerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/passengers/:id', function() {

    it('should route to passenger.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'passengerCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/passengers', function() {

    it('should route to passenger.controller.create', function() {
      routerStub.post
        .withArgs('/', 'passengerCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/passengers/:id', function() {

    it('should route to passenger.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'passengerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/passengers/:id', function() {

    it('should route to passenger.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'passengerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/passengers/:id', function() {

    it('should route to passenger.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'passengerCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
