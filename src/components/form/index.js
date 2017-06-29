import React from "react";
import PropTypes from "prop-types";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.components = {};
    this.state = {
      valid: false
    };
  }

  getChildContext() {
    return {
      validation: {
        register: ((component, key = null) => {

          if(Object.values(this.components).indexOf(component) != -1) {
            return;
          }

          if(typeof(key) !== "string") {
            key = `_key_${Object.keys(this.components).length}`;
          }

          if(typeof(this.components[key]) === "undefined") {
            this.components[key] = component;
          }
        }),

        unregister: ((component) => {
          for(let key of Object.keys(this.components)) {
            if(this.components[key] === component) {
              delete this.components[key]
              break;
            }
          }
        }),

        hasValidated: (() => {
          this.setState({
            valid: Object.values(this.components).reduce((acc, component) => { return acc && component.validate().valid; }, true)
          });
        }),

        valid: (() => {
          return this.state.valid;
        }),

        componentValid: ((key) => {
          let component = this.components[key];

          if(typeof(component) === "undefined") {
            throw new Error(`Component "${key}" was not found. Make sure the component you are targeting has a "key" prop set.`);
          } else {
            return component.validate();
          }
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
