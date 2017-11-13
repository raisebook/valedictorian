import React from "react";
import PropTypes from "prop-types";
import ValidatableInput from "../validatable-input";

export default class Select extends ValidatableInput {
  render() {
    let props = Object.assign({}, this.props, {
      onChange: this.update(),
      ref: this.props.inputRef
    });

    delete props["validators"];
    delete props["initial"];
    delete props["inputRef"];

    return (
      <select {...props}>{this.props.children}</select>
    );
  }
}

Select.contextTypes = {
  validation: PropTypes.object
};
