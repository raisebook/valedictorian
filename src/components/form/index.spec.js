import React from 'react';
import PropTypes from 'prop-types';
import { shallow, } from 'enzyme';

import Form from './';

describe('<Form>', () => {
  let enzymeWrapper = null;

  describe("getChildContext", () => {
    let component;

    describe("register", () => {
      let form, subject, component;

      describe("without key", () => {
        beforeEach(() => {
          form = new Form();
          subject = form.getChildContext().validation.register;
          component = {
            validate: () => {}
          };
          subject(component);
        });

        it("add the component to the list", () => {
          expect(Object.values(form.components).indexOf(component)).to.equal(0);
        });

        it("creates a fake key", () => {
          expect(Object.keys(form.components)[0]).to.equal("_key_0");
        });

        it("Only add the component once ", () => {
          subject(component);
          expect(Object.values(form.components).length).to.equal(1);
        });

        describe("unregister", () => {
          it("removes the component from the list", () => {
            form.getChildContext().validation.unregister(component);
            expect(Object.values(form.components).indexOf(component)).to.equal(-1);
          });
        });
      });

      describe("with key", () => {
        beforeEach(() => {
          form = new Form();
          subject = form.getChildContext().validation.register;
          component = {
            validate: () => {}
          };
          subject(component, 'component');
        });

        it("Adds the component to the list", () => {
          expect(Object.values(form.components).indexOf(component)).to.equal(0);
        });

        it("Is referencable by the key", () => {
          expect(form.components['component']).to.equal(component);
        });

        it("Only add the component once ", () => {
          let otherComponet = {
            validate: () => {}
          };

          subject(otherComponet);
          expect(form.components['component']).to.equal(component);
        });

        describe("with a key", () => {
          it("removes the component from the list", () => {
            form.getChildContext().validation.unregister(component);
            expect(Object.values(form.components).indexOf(component)).to.equal(-1);
          });

          it("removes the key from the list", () => {
            form.getChildContext().validation.unregister(component);
            expect(Object.keys(form.components).indexOf('component')).to.equal(-1);
          });
        });
      });
    });

    describe("hasValidated", () => {
      let form, setStateStub, validators = [];

      let valid = {
        validate: () => {
          return {
            valid: true,
            errors: null,
            changed: false
          }
        }
      };

      let invalid = {
        validate: () => {
          return {
            valid: false,
            errors: [ 'invalid' ],
            changed: true
          }
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
          expect(setStateStub).to.have.been.calledWith(sinon.match({ valid: true }));
        });
      });

      describe("all valid validators", () => {
        beforeEach(() => {
          validators = [ valid, valid, valid];
          form = subject();
        });

        it("sets the valid state to true", () => {
          expect(setStateStub).to.have.been.calledWith(sinon.match({ valid: true }));
        });
      });

      describe("one invalid validators", () => {
        beforeEach(() => {
          validators = [ valid, invalid, valid];
          form = subject();
        });

        it("sets the valid state to true", () => {
         expect(setStateStub).to.have.been.calledWith(sinon.match({ valid: false }));
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

    describe("componentValid", () => {
      let form, component;
      describe("component does not exist", () => {
        it("raises an error");
      });

      describe("Component exists", () => {
        beforeEach(() => {
          component = {}
        });

        describe("and is valid", () => {
          beforeEach(() => {
            component.validate = () => {
              return {
                valid: true,
                errors: null,
                changed: false
              }
            }
            form = new Form();
            form.getChildContext().validation.register(component, 'component');
          });

          it("returns true", () => {
            expect(form.getChildContext().validation.componentValid('component').valid).to.eq(true);
          });

          it("returns an empty error set", () => {
            expect(form.getChildContext().validation.componentValid('component').errors).to.eq(null);
          });
        });

        describe("and is not valid", () => {
          beforeEach(() => {
            component.validate = () => {
              return {
                valid: false,
                errors: [ 'invalid' ],
                changed: true
              }
            }
            form = new Form();
            form.getChildContext().validation.register(component, 'component');
          });

          it("returns false", () => {
            expect(form.getChildContext().validation.componentValid('component').valid).to.eq(false);
          });

          it("returns an error set", () => {
            expect(form.getChildContext().validation.componentValid('component').errors).to.deep.eq([ 'invalid' ]);
          });
        });
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
