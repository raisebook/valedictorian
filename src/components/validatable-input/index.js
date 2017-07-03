import React from "react";
import PropTypes from "prop-types";
import Validator from "../../lib/validator";

export default class ValidatableInput extends React.Component {
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

  validate() {
    let newState = this.validator.validate(this.state);

    this.setState(newState);

    if(this.props.onValidate) {
      this.props.onValidate(newState);
    }

    return newState;
  }

  update() {
    let context = this;

    return function(e) {
      let state = { value: e.target.value, changed: true };
      context.setState(state, () => {
        // If part of a validation group, let the parent call validate
        if(context.context.validation) {
          context.context.validation.validate();
        } else {
          context.validate();
        }
      });

      if(context.props.onChange) {
        context.props.onChange.apply(this, arguments);
      }
    };
  }
}

ValidatableInput.contextTypes = {
  validation: PropTypes.object
};
