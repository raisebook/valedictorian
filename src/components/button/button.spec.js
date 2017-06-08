import React from 'react';
import PropTypes from 'prop-types';
import { mount , shallow } from 'enzyme';

import Button from './button';

describe('<Button>', () => {
  let enzymeWrapper = null;
  let context = null;

  beforeEach(() => {
    context = {
      validation: {
        valid: sinon.stub()
      }
    }
  });

  describe("render", () => {
    let props = {};

    describe("context", () => {
      let subject = () => {
        return mount(<Button {...props}>Button</Button>, { context: context });
      };

      it("renders an button element", () => {
        expect(subject().find("button")).to.have.length(1);
      });

      describe("invalid form", () => {
        beforeEach(() => {
          context.validation.valid.returns(false)
        });

        it("renders a disabled button", () => {
          expect(subject().find("button").props().disabled).to.eq(true);
        });
      });

      describe("valid form", () => {
        beforeEach(() => {
          context.validation.valid.returns(true)
        });

        it("renders an enabled button", () => {
          expect(subject().find("button").props().disabled).to.eq(false);
        });
      });
    });

    describe("no context", () => {
      let subject = () => {
        return mount(<Button {...props}>Button</Button>);
      };

      describe("disabled prop", () => {
        it("renders a disabled button", () => {
          props.disabled = true;
          expect(subject().find("button").props().disabled).to.eq(true);
        });
      });

      describe("enabled prop", () => {
        it("renders an enabled button", () => {
          props.disabled = false;
          expect(subject().find("button").props().disabled).to.eq(false);
        });
      });
    });
  });
});
