import React from "react";
import PropTypes from "prop-types";
import ValidatableInput from "../validatable-input";

export default class Input extends ValidatableInput {
  render() {
    let props = Object.assign({}, this.props, {
      onChange: this.update()
    });

    delete props["validators"];
    delete props["initial"];

    return (
      <input {...props} />
    );
  }
}

Input.contextTypes = {
  validation: PropTypes.object
};
