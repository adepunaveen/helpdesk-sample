'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var gamesCtrlStub = {
  index: 'gamesCtrl.index',
  show: 'gamesCtrl.show',
  create: 'gamesCtrl.create',
  update: 'gamesCtrl.update',
  destroy: 'gamesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var gamesIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './games.controller': gamesCtrlStub
});

describe('Games API Router:', function() {

  it('should return an express router instance', function() {
    gamesIndex.should.equal(routerStub);
  });

  describe('GET /api/gamess', function() {

    it('should route to games.controller.index', function() {
      routerStub.get
        .withArgs('/', 'gamesCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/gamess/:id', function() {

    it('should route to games.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'gamesCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/gamess', function() {

    it('should route to games.controller.create', function() {
      routerStub.post
        .withArgs('/', 'gamesCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/gamess/:id', function() {

    it('should route to games.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'gamesCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/gamess/:id', function() {

    it('should route to games.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'gamesCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/gamess/:id', function() {

    it('should route to games.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'gamesCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
