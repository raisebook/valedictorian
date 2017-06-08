import React from 'react';
import PropTypes from 'prop-types';
import { shallow, } from 'enzyme';

import Form from './form';

describe('<Form>', () => {
  let enzymeWrapper = null;

  describe("getChildContext", () => {
    let component;

    describe("register", () => {
      let form, subject, component;

      beforeEach(() => {
        form = new Form();
        subject = form.getChildContext().validation.register;
        subject(component);
      });

      it("Adds the component to the list", () => {
        expect(form.components.indexOf(component)).to.equal(0)
      });

      it("Only add the compoment once ", () => {
        subject(component);
        expect(form.components.length).to.equal(1);
      });

      describe("unregister", () => {
        it("removes the component from the list", () => {
          form.getChildContext().validation.unregister(component);
          expect(form.components.length).to.equal(0);
        });
      });
    });

    describe("hasValidated", () => {
      let form, setStateStub, validators = [];

      let valid = {
        valid: () => {
          return true;
        }
      };

      let invalid = {
        valid: () => {
          return false;
        }
      };

      let subject = () => {
        let form = new Form();
        form.components = validators;
        setStateStub = sinon.stub(form, 'setState');
        form.getChildContext().validation.hasValidated();
        return form;
      }

      describe("no validators", () => {
        beforeEach(() => {
          validators = [];
          form = subject();
        });

        it("sets the valid state to true", () => {
          expect(setStateStub).to.have.been.calledWith({ valid: true });
        });
      });

      describe("all valid validators", () => {
        beforeEach(() => {
          validators = [ valid, valid, valid];
          form = subject();
        });

        it("sets the valid state to true", () => {
          expect(setStateStub).to.have.been.calledWith({ valid: true });
        });
      });

      describe("one invalid validators", () => {
        beforeEach(() => {
          validators = [ valid, invalid, valid];
          form = subject();
        });

        it("sets the valid state to true", () => {
         expect(setStateStub).to.have.been.calledWith({ valid: false });
        });
      });
    });

    describe("valid", () => {
      it("returns state.valid", () => {
        let form = new Form();
        form.state.valid = true;
        expect(form.getChildContext().validation.valid()).to.equal(true)
      });
    });
  });

  describe("render", () => {
    let props = {};

    it("renders a form", () => {
      enzymeWrapper = shallow(<Form />);
      expect(enzymeWrapper.find("form")).to.have.length(1);
    });
  });
});
