import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';

import InlineError from './';

describe("<InlineError>", () => {
  let enzymeWrapper = null;
  let component = null;
  let context = null;
  let props = { for: 'component' };

  beforeEach(() => {
    context = {
      validation: {
        addListener: sinon.stub(),
        removeListener: sinon.stub()
      }
    }
  });

  describe("lifecycle", () => {
    beforeEach(() => {
      enzymeWrapper = mount(<InlineError {...props}/>, { context: context });
      component = enzymeWrapper.instance();
    });

    it("should setup the state", () => {
      expect(component.state).to.deep.equal({
        valid: false,
        beenValid: false,
        changed: false,
        value: ""
      });
    });

    it("should create a callback that calls setState", () => {
      let state = sinon.stub();
      let setState = sinon.stub(component, 'setState');
      component.onValidation(state);
      expect(setState).to.have.been.calledWith(state);
    });

    it("registers a listener", () => {
      expect(context.validation.addListener).to.have.been.calledWith('component', component.onValidation);
    });

    it("removes the listener on unmount", () => {
      enzymeWrapper.unmount();
      expect(context.validation.removeListener).to.have.been.calledWith('component', component.onValidation);
    });
  });

  describe("render", () => {
    let props = { for: 'component' };
    let state = {}
    let subject = (() => {
      let enzymeWrapper = shallow(<InlineError {...props} />);
      enzymeWrapper.instance().setState(state);
      return enzymeWrapper;
    });

    describe("valid", () => {
      beforeEach(() => {
        state.valid = true;
        state.beenValid = true;
      });

      it("renders nothing", () => {
        expect(subject().find('span').length).to.equal(0);
      });
    });

    describe("invalid", () => {
      describe("not been valid", () => {
        beforeEach(() => {
          state.valid = false;
          state.beenValid = false;
        });

        it("renders nothing", () => {
          expect(subject().find('span').length).to.equal(0);
        });
      });

      describe("been valid", () => {
        beforeEach(() => {
          state.valid = false;
          state.beenValid = true;
          state.errors = [ 'a', 'b', 'c' ];
        });

        it("renders the errors", () => {
          expect(subject().find('span').length).to.equal(1);
        });

        it("joins the errors with commas", () => {
          expect(subject().find('span').text()).to.equal("a, b, c");
        });
      });
    });
  });
});
