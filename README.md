<h2 align=center>Cypress cli-select</h2>
<p align="center">
</p>

<p align="center">
Cypress interactive cli prompts to select and run spec(s) and test(s).
</p>

![Cypress-cli-select animated](./assets/cypress-cli-select-animated.gif)

![Cypress-cli-select demo 1](./assets/cypress-cli-select-demo1.png)

![Cypress-cli-select demo 2](./assets/cypress-cli-select-demo2.png)

## Features

- ⌨ New interactive CLI prompts to select and run spec(s) and/or test(s)
- 👟 A new `cypress run` command to allow user to pass desired arguments

#### Table of Contents

- [Features](#features)
  - [Table of Contents](#table-of-contents)
- [📦 Installation](#-installation)
- [✋ Help mode](#-help-mode)
- [👟 Run mode](#-run-mode)
  - [Keyboard controls](#keyboard-controls)
- [🫵 Choose spec pattern](#-choose-spec-pattern)
  - [Keyboard controls](#keyboard-controls)
- [🖨 Print selected](#-print-selected)
- [🎯 Specify a custom cypress.config directory](#-specify-a-custom-cypress-config-directory)
- [📃 Setting up a `npm` script](#-setting-up-a-npm-script)
- [🚧 Typescript support](#-typescript-support)
- [🤝 Contributions](#-contributions)

---

## 📦 Installation

1. Install the following packages:

You can either run the executable command via `npx` or install locally via `npm`:

```sh
# Via npx
npx cypress-cli-select run

# Install via npm
npm install --save-dev cypress-cli-select
```

In order to run specific test(s) by their title, install the following plugin:

```sh
npm install --save-dev @bahmutov/cy-grep
```

Follow the installation and setup for `@bahmutov/cy-grep` in the project [README](https://github.com/bahmutov/cy-grep)

---

## ✋ Help mode

To open the cli help menu, pass the `--help` flag:

```bash
npx cypress-cli-select run --help
```

![Cypress cli select help menu](./assets/cypress-cli-select-help.png)

---

## 👟 Run mode

If you want to select e2e spec(s) to run, simply run the following command:

```bash
npx cypress-cli-select run
```

For selecting component spec(s):

```bash
npx cypress-cli-select run --component
```

If you have `@bahmutov/cy-grep` plugin installed in your project, you can also select tests to run by their title.

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

## 🫵 Choose spec pattern

If you are interested in running selected specs in a specific order, pass the following flag:

```bash
npx cypress-cli-select run --choose-spec-pattern
```

### Keyboard controls

|               Keys               |             Action              |
| :------------------------------: | :-----------------------------: |
|          <kbd>Up</kbd>           | Move to selection above current |
|         <kbd>Down</kbd>          | Move to selection below current |
| <kbd>Shift</kbd> + <kbd>⬆</kbd> |       Reorder current up        |
| <kbd>Shift</kbd> + <kbd>⬇</kbd> |      Reorder current down       |
|         <kbd>Enter</kbd>         |          Confirm order          |
|        <kbd>Escape</kbd>         |             Cancel              |

![Cypress cli select --choose-spec-pattern](./assets/choose-spec-pattern-demo.gif)

---

## 🖨 Print selected

If you want to print all selected spec(s) and/or test(s) just prior to Cypress run, pass the following flag:

```bash
npx cypress-cli-select run --print-selected
```

![Cypress cli select --print-selected](./assets/print-selected-demo.png)

## Test diff output

At the end of the Cypress run, if the total tests in a spec file is not equal to the number of tests run from that spec file, you will see an output similar to the following:

![Cypress diff output demo](./assets/output-demo.png)

---

## 🎯 Specify a custom cypress config directory

This cli utilizes the [ cypress-find-specs ](https://github.com/bahmutov/find-cypress-specs) package. For more information on specifying a custom path to a cypress.config, see [ custom-config-filename ](https://github.com/bahmutov/find-cypress-specs?tab=readme-ov-file#custom-config-filename).

```bash
# Example
CYPRESS_CONFIG_FILE=path/to/cypress.config.js npx cypress-cli-select run
```

This environment variable will direct this package to look for spec files specified in the config file path.

---

## 📃 Setting up a `npm` script

For convenience, you may desire to house the `npx` command within an npm script in your project's `package.json`, including any desired cli arguments:

```json
  "scripts": {
    "cy:select": "npx cypress-cli-select run --browser=firefox"
  }
```

---

## 🚧 Typescript support

For more information on Typescript support involved with `@bahmutov/cy-grep` package, refer to it's [README](https://github.com/bahmutov/cy-grep?tab=readme-ov-file#typescript-support).

---

## 🤝 Contributions

Feel free to open a pull request or drop any feature request or bug in the [issues](https://github.com/dennisbergevin/cypress-cli-select/issues).

Please see more details in the [contributing doc](./CONTRIBUTING.md).
