let defaultOptions = {
  if: () => true,
  unless: () => false
};

function validate(body, options = {}) {
  return function(obj) {
    options = Object.assign({}, defaultOptions, options);

    if(!options.if() || options.unless()) {
      return obj;
    }

    // Clean up the value, as pretty much every validator expects a trimmed input
    obj = Object.assign({}, obj, {
      value: (obj.value + "").trim()
    });

    let ret = body(obj);

    if(ret.valid) {
      ret.beenValid = true;
    }

    return ret;
  };
}

export function required(options = {}) {
  options = Object.assign({}, {
    message: "is required"
  }, options);

  return validate(function(obj) {
    if(obj.value === "") {
      obj.valid = false;
      obj.errors.push(options.message);
    }

    return obj;
  }, options);
}

export function format(regexp, options = {}) {
  options = Object.assign({}, {
    allowEmpty: false,
    message: "is not valid"
  }, options);

  return validate(function(obj) {
    if(options.allowEmpty === true && obj.value === "") {
      return obj;
    }

    if(!obj.value.match(regexp)) {
      obj.valid = false;
      obj.errors.push(options.message);
    }

    return obj;
  }, options);
}

export function length(len, options = {}) {
  let min = null;
  let max = null;

  if(typeof(len) === "object") {
    min = len.min;
    max = len.max;
  } else {
    max = len;
  }

  options = Object.assign({}, {
    minMessage: "is too short (Min is ${min})",
    maxMessage: "is too long (Max is ${max})"
  }, options);

  return validate(function(obj) {
    if(max && obj.value.length > max) {
      obj.valid = false;
      obj.errors.push(options.maxMessage.replace(/\${len}|\${max}/, max));
    } else if(min && obj.value.length < min) {
      obj.valid = false;
      obj.errors.push(options.minMessage.replace(/\${min}/, min));
    }

    return obj;
  }, options);
}

export function min(minVal, options = {}) {
  options = Object.assign({}, {
    allowEmpty: false,
    message: "Minimum ${min}"
  }, options);

  return validate(function(obj) {
    if(options.allowEmpty === true && obj.value === "") {
      return obj;
    }

    let float = parseFloat(obj.value);
    if(isNaN(float) || float < minVal) {
      obj.valid = false;
      obj.errors.push(options.message.replace(/\${min}/, minVal));
    }

    return obj;
  }, options);
}

export function max(maxVal, options = {}) {
  options = Object.assign({}, {
    allowEmpty: false,
    message: "Maximum ${max}"
  }, options);

  return validate(function(obj) {
    if(options.allowEmpty === true && obj.value === "") {
      return obj;
    }

    let float = parseFloat(obj.value);
    if(isNaN(float) || float > maxVal) {
      obj.valid = false;
      obj.errors.push(options.message.replace(/\${max}/, maxVal));
    }

    return obj;
  }, options);
}

export default class Validator {
  constructor(validators) {
    this.validators = validators;
  }

  validate(obj) {
    obj = Object.assign(
      {},
      {
        beenValid: false
      },
      obj,
      {
        valid: true,
        errors: []
      }
    );

    return this.validators.reduce((obj, validator) => { return validator(obj); }, obj);
  }
}
