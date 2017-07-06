import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';

import Checkbox from './';

describe('<Checkbox>', () => {
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
      return shallow(<Checkbox {...props}/>,);
    };

    describe("initial", () => {
      describe("is the same as value", () => {
        beforeEach(() => { props = { initial: 'a', value: 'a', checkedValue: 'a', uncheckedValue: 'b' } });

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
        beforeEach(() => { props = { value: 'a', checkedValue: 'a', uncheckedValue: 'b' } });

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
        beforeEach(() => { props = { validators: validators, checkedValue: 'a', uncheckedValue: 'b' } });

        it("initializes the validator object with the supplied validators", () => {
          expect(subject().instance().validator.validators).to.deep.equal(validators);
        });
      });
    });
  });

  describe("Lifecycle", () => {
    describe("Nested in a form", () => {
      beforeEach(() => {
        enzymeWrapper = mount(<Checkbox checkedValue="a" uncheckedValue="b" />, { context: context });
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
        let validate = sinon.stub(Checkbox.prototype, 'validate');
        enzymeWrapper = mount(<Checkbox checkedValue="a" uncheckedValue="b" />, { context: context });
        expect(validate).to.have.been.calledOnce;
        validate.restore();
      });
    });
  });

  describe("validate", () => {
    let validator, state, setState;

    beforeEach(() => {
      component = new Checkbox({});
      setState = sinon.stub(component, 'setState');

      state = { valid: false, beenValid: false };

      validator = sinon.stub(component.validator, 'validate');
      validator.returns(state);

      component.state = {
        value: "",
        changed: true
      };
    });

    afterEach(() => {
      validator.restore();
    });

    it("returns the state", () => {
      expect(component.validate()).to.equal(state);
    });

    it("called validate on the validator object", () => {
      component.validate();
      expect(validator).to.have.been.calledWith(component.state);
    });

    it("sets the state", () => {
      component.validate();
      expect(setState).to.have.been.calledWith(state);
    });

    it("calls onValidate", () => {
      component.props.onValidate = sinon.stub();
      component.validate();
      expect(component.props.onValidate).to.have.been.calledWith(state);
    });
  });

  describe("update", () => {
    let el;
    beforeEach(() => {
      el = mount(<Checkbox checkedValue="a" uncheckedValue="b" />);
      component = el.instance();
    });

    it("returns a function", () => {
      expect(typeof(component.update())).to.equal("function");
    });

    describe("with context", () => {
      let context;
      beforeEach(() => {
        context = {
          validation: {
            validate: sinon.stub(),
            register: sinon.stub(),
            unregister: sinon.stub()
          }
        };

        el = mount(<Checkbox checkedValue="a" uncheckedValue="b" />, { context: context });
        component = el.instance();
      });

      it("calls the context validator", () => {
        el.simulate('change', { target: { value: '' } });
        expect(context.validation.validate).to.have.been.called;
      });
    });

    describe("without context", () => {
      it("calls validate", () => {
        let spy = sinon.spy(component, 'validate');
        el.simulate('change', { target: { value: '' } });
        expect(spy).to.have.been.called;
      });
    });

    describe("onChange is set", () => {
      let props;
      beforeEach(() => {
        props = { onChange: sinon.stub() };
        component = new Checkbox(props);
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
    it("renders an Checkbox element", () => {
      enzymeWrapper = shallow(<Checkbox checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]")).to.have.length(1);
    });

    it("passes props", () => {
      enzymeWrapper = shallow(<Checkbox name="test" checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]").prop('name')).to.eq("test");
    });

    it("removes the validators prop", () => {
      enzymeWrapper = shallow(<Checkbox validators={[]} checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]").prop('validators')).to.be.undefined;
    });

    it("overrides the type prop", () => {
      enzymeWrapper = shallow(<Checkbox type="input" validators={[]} checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]")).to.have.length(1);
    });

    it("overrides the checked prop", () => {
      enzymeWrapper = shallow(<Checkbox type="input" checkedValue="a" uncheckedValue="b" value="b" checked={true} />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]").prop('checked')).to.eq(false);
    });

    it("removes the checkedValue prop", () => {
      enzymeWrapper = shallow(<Checkbox validators={[]} checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]").prop('checkedValue')).to.be.undefined;
    });

    it("removes the uncheckedValue prop", () => {
      enzymeWrapper = shallow(<Checkbox validators={[]} checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]").prop('uncheckedValue')).to.be.undefined;
    });

    it("removes the initial prop", () => {
      enzymeWrapper = shallow(<Checkbox initial="b" validators={[]} checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]").prop('initial')).to.be.undefined;
    });

    it("renders the value from the state, not the props", () => {
      enzymeWrapper = shallow(<Checkbox value="b" validators={[]} checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      enzymeWrapper.simulate("change", { target: { checked: true } });
      expect(enzymeWrapper.find("input[type=\"checkbox\"]").prop('value')).to.eq("a");
    });

    it("rebinds onChange with the update method", () => {
      let mock = sinon.stub();
      let update = sinon.stub(Checkbox.prototype, 'update');
      update.returns(mock);
      enzymeWrapper = shallow(<Checkbox ref="rel" validators={[]} checkedValue="a" uncheckedValue="b" />);
      component = enzymeWrapper.instance();
      expect(enzymeWrapper.find("input[type=\"checkbox\"]").prop('onChange')).to.equal(mock);
      update.restore();
    });
  });
});

