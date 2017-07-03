import React from "react";
import PropTypes from "prop-types";
import ValidatableInput from "../validatable-input";

export default class Textarea extends ValidatableInput {
  render() {
    let props = Object.assign({}, this.props, {
      onChange: this.update()
    });

    delete props["validators"];
    delete props["initial"];

    return (
      <textarea {...props}>{this.props.children}</textarea>
    );
  }
}

Textarea.contextTypes = {
  validation: PropTypes.object
};
