/* eslint-disable no-undef */
//util unit tests
var chai  = require('chai');
chai.use(require('chai-datetime'));
let assert  = chai.assert;
let util = require('../../src/components/utils');
let config = require('../../src/components/config');
let testData = require('../test_data');

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
  it('1.3.4 moveListElement. Success move up', (done) => {
    let list = JSON.parse(JSON.stringify(testData.listWithOrder));
    assert.equal(list[1].order, 1);
    util.moveListElement(list, 1, true);
    assert.equal(list[1].order, 2);
    done();
  });  
  it('1.3.5 moveListElement. Success move down', (done) => {
    let list = JSON.parse(JSON.stringify(testData.listWithOrder));
    assert.equal(list[1].order, 1);
    util.moveListElement(list, 1, false);
    assert.equal(list[1].order, 2);
    done();
  });  

  it('1.4.1 reorderElements. Type mismatch `list`', (done) => {
    assert.throws(() => { util.reorderElements('a'); }, 'list should be an Array');
    done();
  });   
  
  it('1.5.1 swapElements. Type mismatch `secondIndex`', (done) => {
    assert.throws(() => { util.swapElements([], 1, 'a'); }, 'secondIndex should be a number');
    done();
  });  
  it('1.5.2 swapElements. Type mismatch `list`', (done) => {
    assert.throws(() => { util.swapElements('a', 1, 1); }, 'list should be an Array');
    done();
  });  
  it('1.5.3 swapElements. Type mismatch `firstIndex`', (done) => {
    assert.throws(() => { util.swapElements([], 'a', 1); }, 'firstIndex should be a number');
    done();
  }); 

  it('1.6.1 helpers. checkbox', (done) => {
    assert.equal(util.helpers.checkbox('Enabled'), '<span title="Enabled"><i class="mdi mdi-check-box-outline"></i></span>');
    assert.equal(util.helpers.checkbox(), '<span title="Disabled"><i class="mdi mdi-checkbox-blank-outline"></i></span>');
    done();
  }); 

  it('1.6.2 helpers. runResult', (done) => {
    assert.equal(util.helpers.runResult(true), '<span class="icon has-text-success" title="Success"><i class="mdi mdi-checkbox-marked-circle"></i></span>');
    assert.equal(util.helpers.runResult(false), '<span class="icon has-text-danger" title="Failure"><i class="mdi mdi-close-circle"></i></span>');
    assert.equal(util.helpers.runResult(null), '');
    done();
  }); 

  it('1.6.3 helpers. retryAttempts', (done) => {
    assert.equal(util.helpers.retryAttempts({interval: 2, number: 1}), '1 per each 2 minute(s)');
    assert.equal(util.helpers.retryAttempts({}), 'No retry');  
    done();
  }); 

  it('1.6.4 helpers. onStepResult', (done) => {
    assert.equal(util.helpers.onStepResult({gotoStep: 1}), 'Go to step 1');
    assert.equal(util.helpers.onStepResult('gotoNextStep'), 'Go to next step');  
    assert.equal(util.helpers.onStepResult('quitWithSuccess'), 'Quit with success');
    assert.equal(util.helpers.onStepResult('quitWithFailure'), 'Quit with failure');        
    done();
  }); 

});