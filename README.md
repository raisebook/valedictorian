# Valedictorian
## Another React validation library

Valedictorian is a React validation library where the validation logic is held close to the input that it applies to.

There is a number of build in validation types, and it is easy to add extra ones.

### Installation
```
yarn add valedictorian
```

## Usage

There are three predefined React components that you can use to build your forms:

Input: Outputs an input field. Takes all the props a normal input can, as well

```
import React from "react";

import { Validation } from "valedictorian";
import { Input, Button, Form } from "valedictorian/components";

class App extends React.Component {
  render() {
    return (
      <Form className={styles.container}>
        <label for="name">Name</label>
        <Input id="name" type="text" placeholder="Name" validators={[ Validation.required() ]} />
        <Button className={styles.button}>Save</Button>
      </Form>
    );
  }
}
```

In this instance, the button will be disabled until the user enters a value.

## Validation types

### Validation.required([options])

Validates true once a valud has been entered

#### Options:

message: A custom message to set when validation fails

#### Example

```
<Input id="name" type="text" placeholder="Name" validators={[ Validator.required() ]} />
```

### Validation.format(RegExp, [options])

Validates true if the supplied regular expression passes

#### Options:

message: A custom message to set when validation fails
allowEmpty: (true|false) If true, the validator will not run on empty inputs.

#### Example

```
<Input id="name" type="text" placeholder="Name" validators={[ Validator.format(/[a-z]+/) ]} />
```

### Validation.min(min, [options])

Validates true if the number representation of the input is greater than or equal to min

#### Options:

message: A custom message to set when validation fails. Use ${min} to substitute the minimum value in the message.

#### Example

```
<Input id="name" type="text" placeholder="Name" validators={[ Validator.min(5) ]} />
```

### Validation.max(max, [options])

Validates true if the number representation of the input is less than or equal to min

#### Options:

message: A custom message to set when validation fails. Use ${max} to substitute the max value in the message.

#### Example

```
<Input id="name" type="text" placeholder="Name" validators={[ Validator.max(5) ]} />
```

### Custom

Custom validator functions should return another function that takes an object. That object
has a value field that is set to the value of the input your are validating.

If validation fails, set the valid attribute to false, and push an error message on to the errors attribute.

#### Example

```
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
