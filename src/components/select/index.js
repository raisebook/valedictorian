import React from "react";
import PropTypes from "prop-types";
import ValidatableInput from "../validatable-input";

export default class Select extends ValidatableInput {
  render() {
    let props = Object.assign({}, this.props, {
      onChange: this.update()
    });

    delete props["validators"];
    delete props["initial"];

    return (
      <select {...props}>{this.props.children}</select>
    );
  }
}

Select.contextTypes = {
  validation: PropTypes.object
};
