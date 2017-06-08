import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';

import Input from './input';

describe('<Input>', () => {
  let enzymeWrapper = null;
  let component = null;
  let context = null;

  beforeEach(() => {
    context = {
      validation: {
        register: sinon.stub(),
        unregister: sinon.stub(),
        hasValidated: sinon.stub(),
        valid: sinon.stub()
      }
    }
  });

  describe("initial state", () => {
    let props = {};

    let subject = () => {
      return shallow(<Input {...props}/>,);
    };

    describe("initial", () => {
      describe("is the same as value", () => {
        beforeEach(() => { props = { initial: 'a', value: 'a' } });

        it("sets the initial state", () => {
          expect(subject().state('initial')).to.equal('a');
        });

        it("sets the changed to false", () => {
          expect(subject().state('changed')).to.equal(false);
        });

        it("sets the value state", () => {
          expect(subject().state('value')).to.equal('a');
        });
      });

      describe("is not set", () => {
        beforeEach(() => { props = { value: 'a' } });

        it("sets the initial state", () => {
          expect(subject().state('initial')).to.equal('');
        });

        it("sets the changed to false", () => {
          expect(subject().state('changed')).to.equal(true);
        });

        it("sets the value state", () => {
          expect(subject().state('value')).to.equal('a');
        });
      });

      describe("no validators", () => {
        it("initializes the validator object with a empty array", () => {
          expect(subject().instance().validator.validators).to.deep.equal([]);
        });
      });

      describe("with validators", () => {
        let validators = [ function() {} ];
        beforeEach(() => { props = { validators: validators } });

        it("initializes the validator object with the supplied validators", () => {
          expect(subject().instance().validator.validators).to.deep.equal(validators);
        });
      });
    });
  });

  describe("Lifecycle", () => {
    describe("Nested in a form", () => {
      beforeEach(() => {
        enzymeWrapper = mount(<Input />, { context: context });
        component = enzymeWrapper.instance();
      });

      it("registers itself on mount", () => {
        expect(context.validation.register).to.have.been.calledWith(component);
      });

      it("unregisters itself on unmount", () => {
        enzymeWrapper.unmount();
        expect(context.validation.unregister).to.have.been.calledWith(component);
      });

      it("calls validate after mount", () => {
        let validate = sinon.stub(Input.prototype, 'validate');
        enzymeWrapper = mount(<Input />, { context: context });
        expect(validate).to.have.been.calledOnce;
        validate.restore();
      });
    });
  });

  describe("validate", () => {

  });

  describe("valid", () => {
    let validator, state;

    beforeEach(() => {
      component = new Input({});

      validator = sinon.stub(component.validator, 'validate');
      validator.returns({ valid: false });

      state = sinon.stub();
      component.state = state;
    });

    afterEach(() => {
      validator.restore();
    });

    it("returns whether the component is valid or not", () => {
      expect(component.valid()).to.equal(false);
    });

    it("called validate on the validator object", () => {
      component.valid();
      expect(validator).to.have.been.calledWith(state);
    });
  });

  describe("update", () => {
    beforeEach(() => {
      component = new Input({});
    });

    it("returns a function", () => {
      expect(typeof(component.update())).to.equal("function");
    });

    it("calls validate", () => {
      let stub = sinon.stub(component, 'validate');
      let args = {
        target: {
          value: 'value'
        }
      };

      component.update()(args);
      expect(stub).to.have.been.calledWith({ value: 'value', changed: true });
      stub.restore();
    })

    describe("onChange is set", () => {
      let props;
      beforeEach(() => {
        props = { onChange: sinon.stub() };
        component = new Input(props);
      });

      it("calls onChange", () => {
        let stub = sinon.stub(component, 'validate');
        let args = {
          target: {
            value: 'value'
          }
        };

        component.update()(args);
        expect(props.onChange).to.have.been.calledWith(args);
        stub.restore();
      })
    });
  });

  describe("rendering", () => {
    it("renders an input element", () => {
      enzymeWrapper = shallow(<Input />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input")).to.have.length(1);
    });

    it("passes props", () => {
      enzymeWrapper = shallow(<Input type="text" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input").props().type).to.eq("text");
    });

    it("removes the validators prop", () => {
      enzymeWrapper = shallow(<Input type="text" validators={[]} />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input").props().validators).to.be.undefined;
    });

    it("rebinds onChange with the update method", () => {
      let mock = sinon.stub();
      let update = sinon.stub(Input.prototype, 'update');
      update.returns(mock);
      enzymeWrapper = shallow(<Input type="text" validators={[]} />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input").props().onChange).to.equal(mock);
      update.restore();
    });
  });
});

