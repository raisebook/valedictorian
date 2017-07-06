# Valedictorian
## Another React validation library

Valedictorian is a React validation library where the validation logic is held close to the input that it applies to.

There is a number of build in validation types, and it is easy to add extra ones.

### Installation
```bash
yarn add valedictorian
```

## Usage

There are three predefined React components that you can use to build your forms:

Input: Outputs an input field. Takes all the props a normal input can, as well

```javascript
import React from "react";

import { Validation } from "valedictorian";
import { Input, Checkbox, Select, Button, Form } from "valedictorian/components";

class App extends React.Component {
  render() {
    return (
      <Form className={styles.container}>
        <label for="name">Name</label>
        <Input id="name" type="text" placeholder="Name" validators={[ Validation.required() ]} />
        <Checkbox id="awesome" checkedValue="Awesome" uncheckedValue="Not Awesome" value="Not Awesome" />
        <label for="awesome">Awesome</label>
        <Select>
          <option value="foo">Foo</option>
        </Select>
        <Button className={styles.button}>Save</Button>
      </Form>
    );
  }
}
```

In this instance, the button will be disabled until the user enters a value.

## Displaying an inline error

By using the InlineError component, you can display errors next to inputs. The error is only displayed if the input field has at some point been valid, and has become invalid.

You associate the error with an input by defining a name attribute on the Input, and using the for attribute on the InlineError.

Any props are passed through to the underlying span to allow for styling.

```javascript
import React from "react";

import { Validation } from "valedictorian";
import { Input, Button, Form, InlineError } from "valedictorian/components";

class App extends React.Component {
  render() {
    return (
      <Form className={styles.container}>
        <label for="name">Name</label>
        <InlineError for="name" />
        <Input id="name" name="name" type="text" placeholder="Name" validators={[ Validation.required() ]} />
        <Button className={styles.button}>Save</Button>
      </Form>
    );
  }
}
```

## Validation types

### Validation.required([options])

Validates true once a valid has been entered

#### Options:

message: A custom message to set when validation fails

#### Example

```javascript
<Input id="name" type="text" placeholder="Name" validators={[ Validator.required() ]} />
```

### Validation.equal(value, [options])

Validates true if the value of the input is the same as the supplied value. Useful for validating checkboxes, or comparing two inputs

NOTE: The input value is trimmed before testing.

#### Options:

message: A custom message to set when validation fails

#### Example

```javascript
<Checkbox id="accept" checkValue="true" uncheckedValue="false" type="text" validators={[ Validator.equal("true") ]} />
```

### Validation.notEqual(value, [options])

Validates true if the value of the input is not the same as the supplied value. Useful for validating checkboxes, or comparing two inputs

NOTE: The input value is trimmed before testing.

#### Options:

message: A custom message to set when validation fails

#### Example

```javascript
<Checkbox id="accept" checkValue="true" uncheckedValue="false" type="text" validators={[ Validator.notEqual("false") ]} />
```

### Validation.format(RegExp, [options])

Validates true if the supplied regular expression passes

#### Options:

message: A custom message to set when validation fails
allowEmpty: (true|false) If true, the validator will not run on empty inputs.

#### Example

```javascript
<Input id="name" type="text" placeholder="Name" validators={[ Validator.format(/[a-z]+/) ]} />
```

### Validation.length(len, [options])

Validates true if the length of the string is greater than min and less than max

#### Options:

minMessage: A custom message to set when the character count is less than min. Use ${min} to substitute the minimum value in the message.
maxMessage: A custom message to set when the character count is greater than max. Use ${max} to substitube the max value in the message.

#### Example

```javascript
<Input id="name" type="text" placeholder="Name" validators={[ Validator.length({ min: 5 }) ]} />
<Input id="name" type="text" placeholder="Name" validators={[ Validator.length({ max: 5 }) ]} />
<Input id="name" type="text" placeholder="Name" validators={[ Validator.length({ min: 3, max: 5 }) ]} />
```

### Validation.min(min, [options])

Validates true if the number representation of the input is greater than or equal to min

#### Options:

message: A custom message to set when validation fails. Use ${min} to substitute the minimum value in the message.

#### Example

```javascript
<Input id="name" type="text" placeholder="Name" validators={[ Validator.min(5) ]} />
```

### Validation.max(max, [options])

Validates true if the number representation of the input is less than or equal to min

#### Options:

message: A custom message to set when validation fails. Use ${max} to substitute the max value in the message.

#### Example

```javascript
<Input id="name" type="text" placeholder="Name" validators={[ Validator.max(5) ]} />
```

### Custom

Custom validator functions should return another function that takes an object. That object
has a value field that is set to the value of the input your are validating.

If validation fails, set the valid attribute to false, and push an error message on to the errors attribute.

#### Example

```javascript
function matchesText(text) {
  return function(obj) {
    if(obj !== text) {
      obj.valid = false;
      obj.errors.push("Text does not match " + text);
    }

    return obj;
  }
}
```
