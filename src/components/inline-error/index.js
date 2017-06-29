import React from "react";
import PropTypes from "prop-types";
import Validator from "../../lib/validator";

export default class InlineError extends React.Component {
  render() {
    let validation = this.context.validation.componentValid(this.props.for);

    if(!validation.valid && validation.beenValid) {
      return (<span {...this.props}>{validation.errors.join(', ')}</span>);
    } else {
      return null;
    }
  }
}

InlineError.contextTypes = {
  validation: PropTypes.object
};
