import Validator from './index.js';
import { Validation, Components } from './index.js';

describe("exports", () => {
  describe("default export", () => {
    it("exists", () => {
      expect(Validator).to.not.be.undefined;
    });
  })

  describe("exports", () => {
    it("has Validation", () => {
      expect(Validation).to.not.be.undefined;
    });

    it("has Components", () => {
      expect(Components).to.not.be.undefined;
    });
  });
});
