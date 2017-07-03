import React from 'react';
import PropTypes from 'prop-types';
import { shallow, } from 'enzyme';

import Form from './';

describe('<Form>', () => {
  let enzymeWrapper = null;

  describe("getChildContext", () => {
    let component;

    beforeEach(() => {
      component = {
        props: {}
      }
    });

    describe("register", () => {
      let form, subject;

      beforeEach(() => {
        form = new Form();
        subject = form.getChildContext().validation.register;
        subject(component);
      });

      describe("no name", () => {
        it("Adds the component to the list", () => {
          expect(form.components.indexOf(component)).to.equal(0)
        });

        it("Only add the component once ", () => {
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

      describe("name", () => {
        beforeEach(() => {
          component.props = { name: 'name' };

          form = new Form();
          subject = form.getChildContext().validation.register;
          subject(component);
        });

        it("Adds the name to the nameMap", () => {
          expect(form.nameMap.indexOf('name')).to.equal(0)
        });

        describe("unregister", () => {
          it("removes the component from the list", () => {
            form.getChildContext().validation.unregister(component);
            expect(form.nameMap.length).to.equal(0);
          });
        });
      });
    });

    describe("addListener", () => {
      let form, subject, listener;

      beforeEach(() => {
        listener = { listener: 1 };
        form = new Form();
        subject = form.getChildContext().validation.addListener;
        subject('name', listener);
      });

      it("Adds the listener to the list", () => {
        expect(form.listeners['name'].indexOf(listener)).to.equal(0)
      });

      it("Only adds the matching listener once", () => {
        subject('name', listener);
        expect(form.listeners['name'].length).to.equal(1)
      });

      it("Adds multiple listeners against the name ", () => {
        let listener2 = { listener: 2 };
        subject('name', listener2);
        expect(form.listeners['name'].length).to.equal(2);
      });

      describe("unregister", () => {
        it("removes the listener from the list", () => {
          form.getChildContext().validation.removeListener('name', listener);
          expect(form.listeners['name'].length).to.equal(0);
        });
      });
    });

    describe("validate", () => {
      let form, setStateStub, validators = [], nameMap = [], listeners = {};

      let valid = {
        props: {},
        validate: () => {
          return {
            valid: true
          };
        }
      };

      let invalid = {
        props: {},
        validate: () => {
          return {
            valid: false
          };
        }
      };

      let subject = () => {
        let form = new Form();
        form.components = validators;
        form.nameMap = nameMap;
        form.listeners = listeners;
        setStateStub = sinon.stub(form, 'setState');
        form.getChildContext().validation.validate();
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
          validators = [ valid, valid, valid ];
          form = subject();
        });

        it("sets the valid state to true", () => {
          expect(setStateStub).to.have.been.calledWith({ valid: true });
        });
      });

      describe("one invalid validators", () => {
        beforeEach(() => {
          validators = [ valid, invalid, valid ];
          form = subject();
        });

        it("sets the valid state to true", () => {
         expect(setStateStub).to.have.been.calledWith({ valid: false });
        });
      });

      describe("named", () => {
        let listener;
        beforeEach(() => {
          validators = [ valid, valid, valid ];
          nameMap = [ 'validator1', undefined, undefined ];
          listener = sinon.stub();
          listeners = {
            validator1: [ listener ]
          };
          form = subject();
        });

        it("Calls the listener", () => {
          expect(listener).to.have.been.calledWith({ valid: true });
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
