import Component from './';
import { Button, Form, Input, Select, InlineError } from './';

describe("exports", () => {
  describe("default export", () => {
    it("exists", () => {
      expect(Component).to.not.be.undefined;
    });

    it("has a Button", () => {
      expect(Component.Button).to.not.be.undefined;
    });

    it("has a Form", () => {
      expect(Component.Form).to.not.be.undefined;
    });

    it("has an Input", () => {
      expect(Component.Input).to.not.be.undefined;
    });

    it("has a Select", () => {
      expect(Component.Select).to.not.be.undefined;
    });

    it("has an InlineError", () => {
      expect(Component.InlineError).to.not.be.undefined;
    });
  })

  describe("exports", () => {
    it("has a Button", () => {
      expect(Button).to.not.be.undefined;
    });

    it("has a Form", () => {
      expect(Form).to.not.be.undefined;
    });

    it("has an Input", () => {
      expect(Input).to.not.be.undefined;
    });

    it("has an Select", () => {
      expect(Select).to.not.be.undefined;
    });

    it("has an InlineError", () => {
      expect(InlineError).to.not.be.undefined;
    });
  });
});
