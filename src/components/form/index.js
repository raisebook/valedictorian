import React from "react";
import PropTypes from "prop-types";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.components = {};
    this.state = {
      valid: false,
      components: {}
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
            this.state.components[key] = component.validate();
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
          let components = {};
          Object.keys(this.components).forEach((key) => {
            components[key] = this.components[key].validate();
          });

          this.setState({
            components: components,
            valid: Object.values(components).reduce((acc, component) => { return acc && component.valid; }, true)
          });
        }),

        valid: (() => {
          return this.state.valid;
        }),

        componentValid: ((key) => {
          let validatity = this.state.components[key];

          if(typeof(validatity) === "undefined") {
            throw new Error(`Component "${key}" was not found. Make sure the component you are targeting has a "name" prop set.`);
          } else {
            return validatity;
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
