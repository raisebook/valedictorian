import React from "react";
import PropTypes from "prop-types";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.components = [];
    this.state = {
      valid: false
    };
  }

  getChildContext() {
    return {
      validation: {
        register: ((component) => {
          if(this.components.indexOf(component) === -1) {
            this.components.push(component);
          }
        }),

        unregister: ((component) => {
          this.components = this.components.filter((c) => { return c !== component; });
        }),

        validate: (() => {
          let valid = this.components.reduce((acc, component) => { return acc && component.validate().valid; }, true);

          this.setState({
            valid: valid
          });
        }),

        valid: (() => {
          return this.state.valid;
        })
      }
    };
  }

  render() {
    return (
      <form {...this.props}>
        {this.props.children}
      </form>
    );
  }
}

Form.childContextTypes = {
  validation: PropTypes.object
};
