import React from "react";
import PropTypes from "prop-types";
import Validator from "../../lib/validator";

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.validator = new Validator(this.props.validators || []);

    let initial = this.props.initial || "";

    this.state = this.validator.validate({
      changed: this.props.value !== initial,
      value: this.props.value,
      initial: initial
    });
  }

  componentWillMount() {
    if(this.context.validation) {
      this.context.validation.register(this);
    }
  }

  componentDidMount() {
    this.validate();
  }

  componentWillUnmount() {
    if(this.context.validation) {
      this.context.validation.unregister(this);
    }
  }

  validate(state) {
    let newState = this.validator.validate(Object.assign({}, this.state, state));

    if(this.context.validation) {
      this.setState(newState, () => {
        // Wait for the state to update, then notify the form context
        this.context.validation.hasValidated();
      });
    }

    if(this.props.onValidate) {
      this.props.onValidate({
        valid: newState.valid,
        error: newState.error
      });
    }
  }

  valid() {
    return this.validator.validate(this.state).valid;
  }

  update() {
    let context = this;

    return function(e) {
      context.validate({ value: e.target.value, changed: true });

      if(context.props.onChange) {
        context.props.onChange.apply(this, arguments);
      }
    };
  }

  render() {
    let props = Object.assign({}, this.props, {
      onChange: this.update()
    });

    delete props["validators"];

    return (
      <input {...props} />
    );
  }
}

Input.contextTypes = {
  validation: PropTypes.object
};
