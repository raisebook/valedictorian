import * as Validators from './';
import Validator from './';

describe("Validators", () => {
  let validate, obj, options, result;

  let subject = () => {
    obj = Object.assign({}, { beenValid: false }, obj);
    return validate(obj);
  };

  function isAValidator(setup, passVal, failVal) {
    describe("if guard", () => {
      it("runs if if guard is true", () => {
        expect(setup({ if: () => true })(failVal).valid).to.equal(false);
      });

      it("does not runs if if guard is false", () => {
        expect(setup({ if: () => false })(failVal).valid).to.equal(true);
      });
    });

    describe("unless guard", () => {
      it("runs if unless guard is false", () => {
        expect(setup({ unless: () => false })(failVal).valid).to.equal(false);
      });

      it("does not runs if unless guard is true", () => {
        expect(setup({ unless: () => true })(failVal).valid).to.equal(true);
      });
    });
  }

  describe("required", () => {
    beforeEach(() => { validate = Validators.required(); });

    isAValidator(
      (options) => Validators.required(options),
      { value: 'not empty', valid: true, errors: [] },
      { value: '', valid: true, errors: [] }
    );

    describe("empty", () => {
      beforeEach(() => { obj = { value: '', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'is required'", () => {
          expect(subject().errors).to.deep.equal([ "is required" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.required({ message: "must be set" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "must be set" ]);
        });
      });
    });

    describe("not empty", () => {
      beforeEach(() => { obj = { value: 'not empty', valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("empty with whitespace", () => {
      beforeEach(() => { obj = { value: '    ' , valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "is required" ]);
      });
    });

    describe("already invalid", () => {
      beforeEach(() => { obj = { value: 'not empty' , valid: false, errors: [ "is invalid" ] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "is invalid" ]);
      });
    });
  });

  describe("equal", () => {
    beforeEach(() => { validate = Validators.equal('a'); });

    isAValidator(
      (options) => Validators.equal('a', options),
      { value: 'a', valid: true, errors: [] },
      { value: 'b', valid: true, errors: [] }
    );

    describe("not equal", () => {
      beforeEach(() => { obj = { value: 'b', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'is not equal'", () => {
          expect(subject().errors).to.deep.equal([ "is not equal" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.equal('a', { message: "must be equal" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "must be equal" ]);
        });
      });
    });

    describe("equal", () => {
      beforeEach(() => { obj = { value: 'a', valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("already invalid", () => {
      beforeEach(() => { obj = { value: 'a' , valid: false, errors: [ "invalid" ] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "invalid" ]);
      });
    });
  });

  describe("notEqual", () => {
    beforeEach(() => { validate = Validators.notEqual('b'); });

    isAValidator(
      (options) => Validators.notEqual('b', options),
      { value: 'a', valid: true, errors: [] },
      { value: 'b', valid: true, errors: [] }
    );

    describe("equal", () => {
      beforeEach(() => { obj = { value: 'b', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'is equal'", () => {
          expect(subject().errors).to.deep.equal([ "is equal" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.notEqual('b', { message: "must be not equal" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "must be not equal" ]);
        });
      });
    });

    describe("not equal", () => {
      beforeEach(() => { obj = { value: 'a', valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("already invalid", () => {
      beforeEach(() => { obj = { value: 'a' , valid: false, errors: [ "invalid" ] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "invalid" ]);
      });
    });
  });

  describe("evaluate", () => {
    let retTrue = (val) => { return val === "true" };
    let retFalse = (val) => { return val === "false"; };
    beforeEach(() => { validate = Validators.evaluate(retTrue); });

    isAValidator(
      (options) => Validators.evaluate(retTrue, options),
      { value: "true", valid: true, errors: [] },
      { value: "false", valid: true, errors: [] }
    );

    describe("evaluates to false", () => {
      beforeEach(() => { obj = { value: "false", valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'is not valid'", () => {
          expect(subject().errors).to.deep.equal([ "is not valid" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.evaluate(retTrue, { message: "must be true" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "must be true" ]);
        });
      });
    });

    describe("evaluates to true", () => {
      beforeEach(() => { obj = { value: "true", valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("already invalid", () => {
      beforeEach(() => { obj = { value: "true" , valid: false, errors: [ "invalid" ] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "invalid" ]);
      });
    });
  });

  describe("format", () => {
    beforeEach(() => { validate = Validators.format(/[a-z]+/); });

    isAValidator(
      (options) => Validators.format(/[a-z]+/, options),
      { value: 'abc', valid: true, errors: [] },
      { value: '123', valid: true, errors: [] }
    );

    describe("empty", () => {
      describe("allowEmpty is true", () => {
        beforeEach(() => { validate = Validators.format(/[a-z]+/, { allowEmpty: true }); });
        beforeEach(() => { obj = { value: '', valid: true, errors: [] }; });

        it("evaluates to valid", () => {
          expect(subject().valid).to.equal(true);
        });

        it("sets error message to null", () => {
          expect(subject().errors).to.deep.equal([]);
        });
      });

      describe("allowEmpty is false", () => {
        beforeEach(() => { validate = Validators.format(/[a-z]+/, { allowEmpty: false }); });
        beforeEach(() => { obj = { value: '', valid: true, errors: [] }; });

        it("evaluates to not valid", () => {
          expect(subject().valid).to.equal(false);
        });

        describe("default message", () => {
          it("sets error message to 'is required'", () => {
            expect(subject().errors).to.deep.equal([ "is not valid" ]);
          });
        });
      });
    });

    describe("no match", () => {
      beforeEach(() => { obj = { value: '123', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'is not valid'", () => {
          expect(subject().errors).to.deep.equal([ "is not valid" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.format(/[a-z]+/, { message: "is not right" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "is not right" ]);
        });
      });
    });

    describe("matches", () => {
      beforeEach(() => { obj = { value: 'abc', valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });


    describe("already invalid", () => {
      beforeEach(() => { obj = { value: 'abc' , valid: false, errors: [ "is invalid" ] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "is invalid" ]);
      });
    });
  });

  describe("length", () => {
    beforeEach(() => { validate = Validators.length(5); });

    isAValidator(
      (options) => Validators.length(5, options),
      { value: 'aaaaa', valid: true, errors: [] },
      { value: 'aaaaaa', valid: true, errors: [] }
    );

    describe("len as object", () => {
      describe("max", () => {
        beforeEach(() => { validate = Validators.length({ max: 5 }); });

        describe("bigger than length", () => {
          beforeEach(() => { obj = { value: 'aaaaaa', valid: true, errors: [] }; });

          it("evaluates to not valid", () => {
            expect(subject().valid).to.equal(false);
          });

          describe("default message", () => {
            it("sets error message to 'is too long (Max is 5)'", () => {
              expect(subject().errors).to.deep.equal([ "is too long (Max is 5)" ]);
            });
          });

          describe("custom message", () => {
            beforeEach(() => { validate = Validators.length({ max: 5 }, { maxMessage: "less than ${max} please" }); });

            it("sets error message to the custom message", () => {
              expect(subject().errors).to.deep.equal([ "less than 5 please" ]);
            });
          });
        });
      });

      describe("min", () => {
        beforeEach(() => { validate = Validators.length({ min: 5 }); });

        describe("smaller than length", () => {
          beforeEach(() => { obj = { value: 'aaaa', valid: true, errors: [] }; });

          it("evaluates to not valid", () => {
            expect(subject().valid).to.equal(false);
          });

          describe("default message", () => {
            it("sets error message to 'is too short (Min is 5)'", () => {
              expect(subject().errors).to.deep.equal([ "is too short (Min is 5)" ]);
            });
          });

          describe("custom message", () => {
            beforeEach(() => { validate = Validators.length({ min: 5 }, { minMessage: "more than ${min} please" }); });

            it("sets error message to the custom message", () => {
              expect(subject().errors).to.deep.equal([ "more than 5 please" ]);
            });
          });
        });
      });

      describe("min and max", () => {
        beforeEach(() => { validate = Validators.length({ min: 3, max: 5 }); });

        describe("smaller than min", () => {
          beforeEach(() => { obj = { value: 'aa', valid: true, errors: [] }; });

          it("evaluates to not valid", () => {
            expect(subject().valid).to.equal(false);
          });

          describe("default message", () => {
            it("sets error message to 'is too short (Min is 3)'", () => {
              expect(subject().errors).to.deep.equal([ "is too short (Min is 3)" ]);
            });
          });

          describe("custom message", () => {
            beforeEach(() => { validate = Validators.length({ min: 3, max: 5 } , { minMessage: "more than ${min} please" }); });

            it("sets error message to the custom message", () => {
              expect(subject().errors).to.deep.equal([ "more than 3 please" ]);
            });
          });
        });

        describe("larger than max", () => {
          beforeEach(() => { obj = { value: 'aaaaaa', valid: true, errors: [] }; });

          it("evaluates to not valid", () => {
            expect(subject().valid).to.equal(false);
          });

          describe("default message", () => {
            it("sets error message to 'is too long (Max is 5)'", () => {
              expect(subject().errors).to.deep.equal([ "is too long (Max is 5)" ]);
            });
          });

          describe("custom message", () => {
            beforeEach(() => { validate = Validators.length({ min: 3, max: 5 }, { maxMessage: "smaller than ${max} please" }); });

            it("sets error message to the custom message", () => {
              expect(subject().errors).to.deep.equal([ "smaller than 5 please" ]);
            });
          });
        });
      });
    });

    describe("bigger than length", () => {
      beforeEach(() => { obj = { value: 'aaaaaa', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'is too long (Max is 5)'", () => {
          expect(subject().errors).to.deep.equal([ "is too long (Max is 5)" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.length(5, { maxMessage: "less than ${len} please" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "less than 5 please" ]);
        });
      });
    });

    describe("equal to length", () => {
      beforeEach(() => { obj = { value: 'aaaaa', valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("less than length", () => {
      beforeEach(() => { obj = { value: 'aaaa' , valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("already invalid", () => {
      beforeEach(() => { obj = { value: 'aaaa' , valid: false, errors: [ "is invalid" ] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "is invalid" ]);
      });
    });
  });

  describe("min", () => {
    beforeEach(() => { validate = Validators.min(5); });

    isAValidator(
      (options) => Validators.min(5, options),
      { value: '5', valid: true, errors: [] },
      { value: '4', valid: true, errors: [] }
    );

    describe("empty", () => {
      describe("allowEmpty is true", () => {
        beforeEach(() => { validate = Validators.min(5, { allowEmpty: true }); });
        beforeEach(() => { obj = { value: '', valid: true, errors: [] }; });

        it("evaluates to valid", () => {
          expect(subject().valid).to.equal(true);
        });

        it("sets error message to null", () => {
          expect(subject().errors).to.deep.equal([]);
        });
      });

      describe("allowEmpty is false", () => {
        beforeEach(() => { validate = Validators.min(5, { allowEmpty: false }); });
        beforeEach(() => { obj = { value: '', valid: true, errors: [] }; });

        it("evaluates to not valid", () => {
          expect(subject().valid).to.equal(false);
        });

        describe("default message", () => {
          it("sets error message to 'is required'", () => {
            expect(subject().errors).to.deep.equal([ "Minimum 5" ]);
          });
        });
      });
    });

    describe("not a number", () => {
      beforeEach(() => { obj = { value: 'four', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'Minimum 5'", () => {
          expect(subject().errors).to.deep.equal([ "Minimum 5" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.min(5, { message: "bigger than ${min} please" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "bigger than 5 please" ]);
        });
      });
    });

    describe("less than min", () => {
      beforeEach(() => { obj = { value: '4', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'Minimum 5'", () => {
          expect(subject().errors).to.deep.equal([ "Minimum 5" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.min(5, { message: "bigger than ${min} please" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "bigger than 5 please" ]);
        });
      });
    });

    describe("equal to min", () => {
      beforeEach(() => { obj = { value: '5', valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("bigger than min", () => {
      beforeEach(() => { obj = { value: '6' , valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("already invalid", () => {
      beforeEach(() => { obj = { value: '5' , valid: false, errors: [ "is invalid" ] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "is invalid" ]);
      });
    });
  });

  describe("max", () => {
    beforeEach(() => { validate = Validators.max(5); });

    isAValidator(
      (options) => Validators.max(5, options),
      { value: '5', valid: true, errors: [] },
      { value: '6', valid: true, errors: [] }
    );

    describe("empty", () => {
      describe("allowEmpty is true", () => {
        beforeEach(() => { validate = Validators.max(5, { allowEmpty: true }); });
        beforeEach(() => { obj = { value: '', valid: true, errors: [] }; });

        it("evaluates to valid", () => {
          expect(subject().valid).to.equal(true);
        });

        it("sets error message to null", () => {
          expect(subject().errors).to.deep.equal([]);
        });
      });

      describe("allowEmpty is false", () => {
        beforeEach(() => { validate = Validators.max(5, { allowEmpty: false }); });
        beforeEach(() => { obj = { value: '', valid: true, errors: [] }; });

        it("evaluates to not valid", () => {
          expect(subject().valid).to.equal(false);
        });

        describe("default message", () => {
          it("sets error message to 'Maximum 5'", () => {
            expect(subject().errors).to.deep.equal([ "Maximum 5" ]);
          });
        });
      });
    });

    describe("not a number", () => {
      beforeEach(() => { obj = { value: 'six', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'is required'", () => {
          expect(subject().errors).to.deep.equal([ "Maximum 5" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.max(5, { message: "smaller than ${max} please" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "smaller than 5 please" ]);
        });
      });
    });

    describe("more than max", () => {
      beforeEach(() => { obj = { value: '6', valid: true, errors: [] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      describe("default message", () => {
        it("sets error message to 'is required'", () => {
          expect(subject().errors).to.deep.equal([ "Maximum 5" ]);
        });
      });

      describe("custom message", () => {
        beforeEach(() => { validate = Validators.max(5, { message: "smaller than ${max} please" }); });

        it("sets error message to the custom message", () => {
          expect(subject().errors).to.deep.equal([ "smaller than 5 please" ]);
        });
      });
    });

    describe("equal to max", () => {
      beforeEach(() => { obj = { value: '5', valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("smaller than max", () => {
      beforeEach(() => { obj = { value: '4' , valid: true, errors: [] }; });

      it("evaluates to valid", () => {
        expect(subject().valid).to.equal(true);
      });

      it("sets error message to null", () => {
        expect(subject().errors).to.deep.equal([]);
      });
    });

    describe("already invalid", () => {
      beforeEach(() => { obj = { value: '5' , valid: false, errors: [ "is invalid" ] }; });

      it("evaluates to not valid", () => {
        expect(subject().valid).to.equal(false);
      });

      it("sets error message to is required", () => {
        expect(subject().errors).to.deep.equal([ "is invalid" ]);
      });
    });
  });
});


describe("Validator", () => {
  let alwaysValid = (obj) => {
    return obj;
  };

  let alwaysInvalid = (obj) => {
    obj = Object.assign({}, obj);
    obj.valid = false;
    obj.errors.push('is invalid');
    return obj;
  };

  let validators = [];

  let subject = (obj = { valid: true, errors: [] }) => {
    let validator = new Validator(validators);
    return validator.validate(obj);
  };

  describe("empty set", () => {
    it("returns a valid object", () => {
      expect(subject().valid).to.equal(true);
    });

    it("has an empty errors object", () => {
      expect(subject().errors).to.deep.equal([]);
    });
  });

  describe("all valid", () => {
    beforeEach(() => { validators = [ alwaysValid, alwaysValid, alwaysValid ]});

    it("returns a valid object", () => {
      expect(subject().valid).to.equal(true);
    });

    it("has an empty errors object", () => {
      expect(subject().errors).to.deep.equal([]);
    });

    it("beenValid should be true", () => {
      expect(subject().beenValid).to.equal(true);
    });

    describe("was invalid", () => {
      it("beenValid should be true", () => {
        expect(subject({beenValid: false}).beenValid).to.equal(true);
      });
    });

    describe("was valid", () => {
      it("beenValid should be true", () => {
        expect(subject({beenValid: true}).beenValid).to.equal(true);
      });
    });
  });

  describe("invalid followed by a valid", () => {
    beforeEach(() => { validators = [ alwaysInvalid, alwaysValid ]});

    it("returns a invalid object", () => {
      expect(subject().valid).to.equal(false);
    });

    it("has an error entry for each failing validator", () => {
      expect(subject().errors).to.deep.equal([ "is invalid" ]);
    });

    it("beenValid should be false", () => {
      let results = subject();
      expect(subject().beenValid).to.equal(false);
    });

    describe("was invalid", () => {
      it("beenValid should be false", () => {
        expect(subject({beenValid: false}).beenValid).to.equal(false);
      });
    });

    describe("was valid", () => {
      it("beenValid should be true", () => {
        expect(subject({beenValid: true}).beenValid).to.equal(true);
      });
    });
  });

  describe("valid followed by an invalid", () => {
    beforeEach(() => { validators = [ alwaysValid, alwaysInvalid ]});

    it("returns a invalid object", () => {
      expect(subject().valid).to.equal(false);
    });

    it("has an error entry for each failing validator", () => {
      expect(subject().errors).to.deep.equal([ "is invalid" ]);
    });

    it("beenValid should be false", () => {
      let results = subject();
      expect(subject().beenValid).to.equal(false);
    });

    describe("was invalid", () => {
      it("beenValid should be false", () => {
        expect(subject({beenValid: false}).beenValid).to.equal(false);
      });
    });

    describe("was valid", () => {
      it("beenValid should be true", () => {
        expect(subject({beenValid: true}).beenValid).to.equal(true);
      });
    });
  });

  describe("all invalid", () => {
    beforeEach(() => { validators = [ alwaysInvalid, alwaysInvalid, alwaysInvalid ]});

    it("returns a invalid object", () => {
      expect(subject().valid).to.equal(false);
    });

    it("has an error entry for each failing validator", () => {
      expect(subject().errors).to.deep.equal([ "is invalid", "is invalid", "is invalid" ]);
    });

    it("beenValid should be false", () => {
      expect(subject().beenValid).to.equal(false);
    });

    describe("was invalid", () => {
      it("beenValid should be false", () => {
        expect(subject({beenValid: false}).beenValid).to.equal(false);
      });
    });

    describe("was valid", () => {
      it("beenValid should be true", () => {
        expect(subject({beenValid: true}).beenValid).to.equal(true);
      });
    });
  });
});
