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
  - [Specify a custom cypress.config directory](#specify-a-custom-cypress-config-directory)
  - [📃 Setting up a `npm` script](#-setting-up-a-npm-script)
- [Typescript support](#typescript-support)
- [Contributions](#contributions)

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

To open the cli help menu, add `--help` flag:

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

### Specify a custom cypress config directory

This cli interface utilizes the cypress-find-specs package. For more information on specifying a custom path to a cypress.config, see [ custom-config-filename ](https://github.com/bahmutov/find-cypress-specs?tab=readme-ov-file#custom-config-filename).

```bash
# Example
CYPRESS_CONFIG_FILE=path/to/cypress.config.js npx cypress-cli-select run
```

This environment variable will direct this package to look for spec files specified in the config file path.

### 📃 Setting up a `npm` script

For convenience, you may desire to house the `npx` command within an npm script in your project's `package.json`, including any desired cli arguments:

```json
  "scripts": {
    "cy:select": "npx cypress-cli-select --browser=firefox"
  }
```

## Typescript support

For more information on Typescript support involved with `@bahmutov/cy-grep` package, refer to it's [README](https://github.com/bahmutov/cy-grep?tab=readme-ov-file#typescript-support).

## Contributions

Feel free to open a pull request or drop any feature request or bug in the [issues](https://github.com/dennisbergevin/cypress-cli-select/issues).

Please see more details in the [contributing doc](./CONTRIBUTING.md).
