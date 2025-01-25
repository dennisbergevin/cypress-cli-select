const { render, waitFor } = require("cli-testing-library");
require("cli-testing-library/extend-expect");
const { describe, it, expect } = require("@jest/globals");
const { resolve } = require("path");

describe("basic input prompt flows", () => {
  it("handles spec select", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
    ]);

    expect(
      await findByText(
        "Choose to filter by specs, specific test titles or tags",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Specs")).toBeInTheConsole();
    expect(
      await findByText("Test titles or tags (requires cy-grep)"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Select specs to run")).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/1-getting-started/todo.cy.js"),
    ).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/2-advanced-examples/actions.cy.js"),
    ).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/2-advanced-examples/aliasing.cy.js"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles test title select", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
    ]);

    expect(
      await findByText(
        "Choose to filter by specs, specific test titles or tags",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Specs")).toBeInTheConsole();
    expect(
      await findByText("Test titles or tags (requires cy-grep)"),
    ).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(
      await findByText("Choose to filter by specific test titles or tags"),
    ).toBeInTheConsole();
    expect(
      await findByText("Test titles (requires cy-grep)"),
    ).toBeInTheConsole();
    expect(await findByText("Test tags (requires cy-grep)")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Select tests to run")).toBeInTheConsole();
    expect(
      await findByText(
        "todo.cy.js > example to-do app > displays two todo items by default",
      ),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles tag select", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
    ]);

    expect(
      await findByText(
        "Choose to filter by specs, specific test titles or tags",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Specs")).toBeInTheConsole();
    expect(
      await findByText("Test titles or tags (requires cy-grep)"),
    ).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(
      await findByText("Choose to filter by specific test titles or tags"),
    ).toBeInTheConsole();
    expect(
      await findByText("Test titles (requires cy-grep)"),
    ).toBeInTheConsole();
    expect(await findByText("Test tags (requires cy-grep)")).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(await findByText("Select tags to run")).toBeInTheConsole();
    expect(await findByText("@smoke")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("print selected displays prior to run", () => {
  it("handles spec display", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--print-selected"],
    ]);

    expect(
      await findByText(
        "Choose to filter by specs, specific test titles or tags",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Specs")).toBeInTheConsole();
    expect(
      await findByText("Test titles or tags (requires cy-grep)"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Select specs to run")).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/1-getting-started/todo.cy.js"),
    ).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/2-advanced-examples/actions.cy.js"),
    ).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/2-advanced-examples/aliasing.cy.js"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Spec(s) selected:")).toBeInTheConsole();
    expect(
      await findByText("[ 'cypress/e2e/1-getting-started/todo.cy.js' ]"),
    ).toBeInTheConsole();
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles test title display", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--print-selected"],
    ]);

    expect(
      await findByText(
        "Choose to filter by specs, specific test titles or tags",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Specs")).toBeInTheConsole();
    expect(
      await findByText("Test titles or tags (requires cy-grep)"),
    ).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(
      await findByText("Choose to filter by specific test titles or tags"),
    ).toBeInTheConsole();
    expect(
      await findByText("Test titles (requires cy-grep)"),
    ).toBeInTheConsole();
    expect(await findByText("Test tags (requires cy-grep)")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Select tests to run")).toBeInTheConsole();
    expect(
      await findByText(
        "todo.cy.js > example to-do app > displays two todo items by default",
      ),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Test(s) selected:")).toBeInTheConsole();
    expect(await findByText("spec: 'todo.cy.js',")).toBeInTheConsole();
    expect(
      await findByText("parent: [ 'example to-do app' ],"),
    ).toBeInTheConsole();
    expect(
      await findByText("displays two todo items by default"),
    ).toBeInTheConsole();

    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles tag display", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--print-selected"],
    ]);

    expect(
      await findByText(
        "Choose to filter by specs, specific test titles or tags",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Specs")).toBeInTheConsole();
    expect(
      await findByText("Test titles or tags (requires cy-grep)"),
    ).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(
      await findByText("Choose to filter by specific test titles or tags"),
    ).toBeInTheConsole();
    expect(
      await findByText("Test titles (requires cy-grep)"),
    ).toBeInTheConsole();
    expect(await findByText("Test tags (requires cy-grep)")).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(await findByText("Select tags to run")).toBeInTheConsole();
    expect(await findByText("@smoke")).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(await findByText("Tag(s) selected:")).toBeInTheConsole();
    expect(await findByText("@p2")).toBeInTheConsole();
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("handles choose spec pattern prompt", () => {
  it("handles spec pattern", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--choose-spec-pattern"],
    ]);

    expect(
      await findByText(
        "Choose to filter by specs, specific test titles or tags",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Specs")).toBeInTheConsole();
    expect(
      await findByText("Test titles or tags (requires cy-grep)"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Select specs to run")).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/1-getting-started/todo.cy.js"),
    ).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/2-advanced-examples/actions.cy.js"),
    ).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/2-advanced-examples/aliasing.cy.js"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(
      await findByText("Reorder the specs in desired run order:"),
    ).toBeInTheConsole();
    expect(
      await findByText("> cypress/e2e/1-getting-started/todo.cy.js"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("handles prompt searching", () => {
  it("handles searching", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
    ]);

    expect(
      await findByText(
        "Choose to filter by specs, specific test titles or tags",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Specs")).toBeInTheConsole();
    expect(
      await findByText("Test titles or tags (requires cy-grep)"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Select specs to run")).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/1-getting-started/todo.cy.js"),
    ).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/2-advanced-examples/actions.cy.js"),
    ).toBeInTheConsole();
    expect(
      await findByText("cypress/e2e/2-advanced-examples/aliasing.cy.js"),
    ).toBeInTheConsole();

    await userEvent.keyboard("misc[Enter]", { delay: 300 });
    expect(
      await findByText(
        "? Select specs to run: cypress/e2e/2-advanced-examples/misc.cy.js",
      ),
    ).toBeInTheConsole();

    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("help menu displays", () => {
  it("shows help menu", async () => {
    const { findByText } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--help"],
    ]);

    expect(
      await findByText("Interactive cli prompts to select"),
    ).toBeInTheConsole();

    expect(
      await findByText("npx cypress-cli-select run [args]"),
    ).toBeInTheConsole();
    expect(await findByText("Options:")).toBeInTheConsole();
    expect(await findByText("Examples:")).toBeInTheConsole();
  });
});
