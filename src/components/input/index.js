import React from "react";
import PropTypes from "prop-types";
import Validator from "../../lib/validator";

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.validator = new Validator(this.props.validators || []);

    let initial = this.props.initial || "";
    let value = this.props.value || "";

    this.state = this.validator.validate({
      changed: value !== initial,
      value: value,
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
        errors: newState.errors
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
    delete props["initial"];

    return (
      <input {...props} />
    );
  }
}

Input.contextTypes = {
  validation: PropTypes.object
};
