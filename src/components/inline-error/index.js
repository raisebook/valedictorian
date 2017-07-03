import React from "react";
import PropTypes from "prop-types";

class InlineError extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: false,
      beenValid: false,
      changed: false,
      value: ""
    }

    this.onValidation = ((state) => {
      this.setState(state);
    });
  }

  componentWillMount() {
    if(this.context.validation) {
      this.context.validation.addListener(this.props.for, this.onValidation);
    }
  }

  componentWillUnmount() {
    if(this.context.validation) {
      this.context.validation.removeListener(this.props.for, this.onValidation);
    }
  }

  render() {
    let props = Object.assign({}, this.props);
    delete props['for'];

    if(!this.state.valid && this.state.beenValid) {
      return (<span {...props}>{this.state.errors.join(', ')}</span>);
    } else {
      return null;
    }
  }
}

InlineError.contextTypes = {
  validation: PropTypes.object
};

InlineError.propTypes = {
  for: PropTypes.string.isRequired
}

export default InlineError;
