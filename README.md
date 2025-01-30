<h2 align=center>Cypress cli-select</h2>
<p align="center">
</p>

<p align="center">
Cypress interactive cli prompts to select and run specs, tests or tags.
</p>

<img src="./assets/run-spec-title.gif" alt="Cypress-cli-select demo" loop=infinite>

## Features

- ⌨ New interactive CLI prompts to select and run specs, tests or tags
- 👟 A new `cypress run` command to allow user to pass desired arguments

#### Table of Contents

- [Installation](#installation)
  - [@bahmutov/cy-grep](#@bahmutov/cy-grep)
  - [@cypress/grep](#@cypress/grep)
- [Run mode](#run-mode)
  - [Keyboard controls](#keyboard-controls)
- [Test titles or tags](#test-titles-or-tags)
- [Help mode](#help-mode)
- [Choose spec pattern](#choose-spec-pattern)
  - [Keyboard controls](#keyboard-controls)
- [Print selected](#print-selected)
- [Submit focused](#submit-focused)
- [Using a custom cypress config](#using-a-custom-cypress-config)
- [Setting up a `npm` script](#setting-up-a-npm-script)
- [Typescript support](#typescript-support)
- [Contributions](#contributions)

---

## Installation

1. Install the following package:

```sh
npm install --save-dev cypress-cli-select
```

### `@bahmutov/cy-grep`

In order to run specific tests by their title or tag, install the following plugin:

```sh
npm install --save-dev @bahmutov/cy-grep
```

Follow the installation and setup for `@bahmutov/cy-grep` in the project [README](https://github.com/bahmutov/cy-grep)

### `@cypress/grep`

If you use `@cypress/grep`, you can use this package for specs **or** tag selection, but this package uses functionality not currently supported by `@cypress/grep` to allow for other uses.

---

## Run mode

If you want to select e2e specs to run, simply run the following command:

```bash
npx cypress-cli-select run
```

For selecting component specs:

```bash
npx cypress-cli-select run --component
```

You can also include more cli arguments similar to `cypress run`, as the command harnesses the power of [Cypress module API](https://docs.cypress.io/guides/guides/module-api):

```bash
# Example
npx cypress-cli-select run --component --browser=chrome
```

### Keyboard controls

|              Keys              |             Action              |
| :----------------------------: | :-----------------------------: |
|         <kbd>Up</kbd>          | Move to selection above current |
|        <kbd>Down</kbd>         | Move to selection below current |
|         <kbd>Tab</kbd>         |         Select current          |
| <kbd>Ctrl</kbd> + <kbd>a</kbd> |           Select all            |
|      <kbd>Backspace</kbd>      |        Remove selection         |
|        <kbd>Enter</kbd>        |             Proceed             |
| <kbd>Ctrl</kbd> + <kbd>c</kbd> |              Exit               |

**Note**: You can also filter choices displayed in list by typing

---

## Test titles or tags

If [@bahmutov/cy-grep](https://github.com/bahmutov/cy-grep) package is installed in your project, test titles and tags are available to select.

<img src="./assets/run-spec-tag.gif" alt="Cypress-cli-select tag selection" loop=infinite>

---

## Help mode

To open the cli help menu, pass the `--help` flag:

```bash
npx cypress-cli-select run --help
```

<img src="./assets/run-help.gif" alt="Cypress-cli-select help menu" loop=infinite>

---

## Choose spec pattern

If you are interested in running selected specs in a specific order, pass the following flag:

```bash
npx cypress-cli-select run --choose-spec-pattern
```

**Note**: If you pass `--choose-spec-pattern` you will not have the choice to run test titles or tags.

### Keyboard controls

|               Keys               |             Action              |
| :------------------------------: | :-----------------------------: |
|          <kbd>Up</kbd>           | Move to selection above current |
|         <kbd>Down</kbd>          | Move to selection below current |
| <kbd>Shift</kbd> + <kbd>⬆</kbd> |       Reorder current up        |
| <kbd>Shift</kbd> + <kbd>⬇</kbd> |      Reorder current down       |
|         <kbd>Enter</kbd>         |          Confirm order          |

<img src="./assets/choose-spec-pattern-demo.gif" alt="Cypress-cli-select choose-spec-pattern demo" loop=infinite>

---

## Print selected

If you want to print all selected specs, tests or tags just prior to Cypress run, pass the following flag:

```bash
npx cypress-cli-select run --print-selected
```

![Cypress cli select --print-selected](./assets/print-selected-demo.png)

---

## Submit focused

When no other options are already selected, automatically select the currently focused option with <kbd>Enter</kbd>.

To enable this feature, pass the following flag:

```bash
npx cypress-cli-select run --submit-focused
```

---

## Using a custom cypress config

If you want to use a custom Cypress config, pass it via `--config-file` flag:

```bash
npx cypress-cli-select run --config-file tests/cypress.config.js
```

---

## Setting up a `npm` script

For convenience, you may desire to house the `npx` command within an npm script in your project's `package.json`, including any desired cli arguments:

```json
  "scripts": {
    "cy:select": "npx cypress-cli-select run --browser=firefox"
  }
```

---

## Typescript support

For more information on Typescript support involved with `@bahmutov/cy-grep` package, refer to it's [README](https://github.com/bahmutov/cy-grep?tab=readme-ov-file#typescript-support).

---

## Contributions

Feel free to open a pull request or drop any feature request or bug in the [issues](https://github.com/dennisbergevin/cypress-cli-select/issues).

Please see more details in the [contributing doc](./CONTRIBUTING.md).
