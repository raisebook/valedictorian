import React from "react";
import PropTypes from "prop-types";
import ValidatableInput from "../validatable-input";

export default class Input extends ValidatableInput {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.state, {
      checked: this.value === this.props.checkedValue
    });
  }

  update() {
    let context = this;

    return function(e) {
      let state = {
        checked: e.target.checked,
        value: e.target.checked ? context.props.checkedValue : context.props.uncheckedValue,
        changed: true
      };

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

  render() {
    let props = Object.assign({}, this.props, {
      onChange: this.update()
    });

    let value = this.state.checked ? this.props.checkedValue : this.props.uncheckedValue;
    delete props["validators"];
    delete props["initial"];
    delete props["type"];
    delete props["checked"];
    delete props["uncheckedValue"];
    delete props["checkedValue"];
    delete props["value"];

    return (
      <input type="checkbox" checked={this.state.checked} value={this.state.value} {...props} />
    );
  }
}

Input.contextTypes = {
  validation: PropTypes.object
};

Input.propTypes = {
  checkedValue: PropTypes.string.isRequired,
  uncheckedValue: PropTypes.string.isRequired
}
