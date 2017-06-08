import React from "react";
import PropTypes from "prop-types";

export default class Button extends React.Component {
  render() {
    let disabled = !!this.props.disabled;

    if(this.context.validation) {
      disabled = !this.context.validation.valid();
    }

    return (
      <button {...this.props} disabled={disabled}>{this.props.children}</button>
    );
  }
}

Button.contextTypes = {
  validation: PropTypes.object
};
