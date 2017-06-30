import React from "react";
import PropTypes from "prop-types";

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.components = [];
    this.listeners = {};

    this.nameMap = [];

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
            this.nameMap.push(component.props.name);
          }
        }),

        unregister: ((component) => {
          let index = this.components.indexOf(component);
          this.components = this.components.filter((c, i) => { return index !== i });
          this.nameMap = this.nameMap.filter((c, i) => { return index !== i });
        }),

        addListener: ((name, listener) => {
          if(typeof(this.listeners[name]) === "undefined") {
            this.listeners[name] = [];
          }
          if(this.listeners[name].indexOf(listener) == -1) {
            this.listeners[name].push(listener);
          }
        }),

        removeListener: ((name, listener) => {
          this.listeners[name] = this.listeners[name].filter((l) => { return l !== listener; });
        }),

        validate: (() => {
          let valid = this.components.map((component) => { return component.validate() });

          this.setState({
            valid: valid.reduce((acc, validator) => { return acc && validator.valid; }, true)
          });

          // Notify all the listeners that validation has occurred.
          this.nameMap.forEach((name, index) => {
            if(typeof(name) !== "undefined" && typeof(this.listeners[name]) !== "undefined") {
              this.listeners[name].forEach((listener) => {
                listener(valid[index]);
              });
            }
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
