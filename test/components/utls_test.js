/* eslint-disable no-undef */
//util unit tests
var chai  = require('chai');
chai.use(require('chai-datetime'));
let assert  = chai.assert;
let util = require('../../src/components/utils');
let config = require('../../src/components/config');

describe('util', function() {
  it('1.1 formatDateTime. Success', (done) => {
    assert.equal(util.formatDateTime('2019-05-26T12:55:20.042693', config.tableDateTimeFormat, 'en'), '05/26/2019, 12:55:20');
    done();
  });

  it('1.2 formatDateTime. Empty value', (done) => {
    assert.equal(util.formatDateTime(null, config.tableDateTimeFormat, 'en'), '');
    done();
  });

  it('1.3.1 moveListElement. Type mismatch `direction`', (done) => {
    assert.throws(() => { util.moveListElement([], 1, 'a'); }, 'direction should be boolean');
    done();
  });  
  it('1.3.2 moveListElement. Type mismatch `list`', (done) => {
    assert.throws(() => { util.moveListElement('a', 1, true); }, 'list should be an Array');
    done();
  });  
  it('1.3.3 moveListElement. Type mismatch `index`', (done) => {
    assert.throws(() => { util.moveListElement([], 'a', true); }, 'index should be a number');
    done();
  });  

});