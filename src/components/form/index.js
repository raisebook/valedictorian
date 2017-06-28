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
        register: ((component) => {

          if(Object.values(this.components).indexOf(component) != -1) {
            return;
          }

          let key = `_key_${Object.keys(this.components).length}`;
          if(typeof(component.props) != "undefined" && typeof(component.props.key) == "string") {
            key = component.props.key;
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
            valid: Object.values(this.components).reduce((acc, component) => { return acc && component.valid(); }, true)
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

            return {
              valid: component.valid(),
              errors: component.errors()
            }
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
