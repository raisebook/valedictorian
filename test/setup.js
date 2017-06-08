import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

delete global.expect;

global.NODE_ENV = 'test';
global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;
