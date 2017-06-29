import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';

import InlineError from './';

describe("InlineError", () => {
  let validation, context;
  let subject = () => {
    return shallow(<InlineError ref="component" />, { context: context });
  };

  beforeEach(() => {
    context = {
      validation: {
        componentValid: sinon.stub()
      }
    };
  });

  describe("render", () => {
    describe("valid component", () => {
      beforeEach(() => {
        validation = {
          valid: true,
          errors: null,
          changed: false,
          beenValid: true
        };
      });

      it("Renders nothing", () => {
        context.validation.componentValid.returns(validation);
        expect(subject().find("span").length).to.equal(0);
      });
    });

    describe("invalid component", () => {
      beforeEach(() => {
        validation = {
          valid: false
        };
      });

      describe("been valid", () => {
        beforeEach(() => {
          validation.beenValid = true;
        });

        describe("single error", () => {
          beforeEach(() => {
            validation.errors = [ 'invalid' ];
          });

          it("renders an error", () => {
            context.validation.componentValid.returns(validation);
            expect(subject().find("span").length).to.equal(1);
          });

          it("prints the error", () => {
            context.validation.componentValid.returns(validation);
            expect(subject().find("span").text()).to.equal("invalid");
          });
        });

        describe("multiple error", () => {
          beforeEach(() => {
            validation.errors = [ 'invalid', 'required' ];
          });

          it("renders an error", () => {
            context.validation.componentValid.returns(validation);
            expect(subject().find("span").length).to.equal(1);
          });

          it("prints the error seperated by commas", () => {
            context.validation.componentValid.returns(validation);
            expect(subject().find("span").text()).to.equal("invalid, required");
          });
        });
      });

      describe("not been valid", () => {
        beforeEach(() => {
          validation.beenValid = false;

          it("Renders nothing", () => {
            context.validation.componentValid.returns(validation);
            expect(subject().find("span").length).to.equal(0);
          });
        });
      });
    });
  });
});
