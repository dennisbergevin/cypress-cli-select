const { render } = require("cli-testing-library");
require("cli-testing-library/extend-expect");
const { describe, it, expect } = require("@jest/globals");
const { resolve } = require("path");

describe("e2e: basic input prompt flows", () => {
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
    expect(await findByText("Test titles")).toBeInTheConsole();
    expect(await findByText("Test tags")).toBeInTheConsole();

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
    expect(await findByText("Test titles")).toBeInTheConsole();
    expect(await findByText("Test tags")).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(await findByText("Select tags to run")).toBeInTheConsole();
    expect(await findByText("@smoke")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("e2e: prompt flags skip beginning prompts", () => {
  it("handles --specs flag", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--specs"],
    ]);

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

  it("handles --titles flag", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--titles"],
    ]);

    expect(await findByText("Select tests to run")).toBeInTheConsole();
    expect(
      await findByText(
        "todo.cy.js > example to-do app > displays two todo items by default",
      ),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles --tags flag", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--tags"],
    ]);

    expect(await findByText("Select tags to run")).toBeInTheConsole();
    expect(await findByText("@smoke")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("cannot pass both --titles and --tags", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--titles"],
      ["--tags"],
    ]);

    expect(
      await findByText("Cannot choose both titles and tags"),
    ).toBeInTheConsole();
  });
});

describe("e2e: print selected displays prior to run", () => {
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
    expect(await findByText("Test titles")).toBeInTheConsole();
    expect(await findByText("Test tags")).toBeInTheConsole();

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
    expect(await findByText("Test titles")).toBeInTheConsole();
    expect(await findByText("Test tags")).toBeInTheConsole();

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

describe("e2e: handles choose spec pattern prompt", () => {
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
      await findByText("Test titles or tags (requires cy-grep) (disabled)"),
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

describe("e2e: handles prompt searching", () => {
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

describe("e2e: accepts custom cypress config", () => {
  it("specs: passing --config-file reads e2e specPattern", async () => {
    const { findByText, queryByText, userEvent } = await render(
      "cd ../../../ && node",
      [
        resolve(__dirname, "../index.js"),
        ["--submit-focused"],
        ["--config-file"],
        ["cypress.new.config.js"],
      ],
    );

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

    expect(await queryByText("src/components")).not.toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Running Cypress:")).toBeInTheConsole();
  });

  it("titles: passing --config-file reads e2e specPattern", async () => {
    const { findByText, queryByText, userEvent } = await render(
      "cd ../../../ && node",
      [
        resolve(__dirname, "../index.js"),
        ["--submit-focused"],
        ["--config-file"],
        ["cypress.new.config.js"],
      ],
    );

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
    expect(await findByText("Test titles")).toBeInTheConsole();
    expect(await findByText("Tags")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Select tests to run")).toBeInTheConsole();
    expect(
      await findByText(
        "todo.cy.js > example to-do app > displays two todo items by default",
      ),
    ).toBeInTheConsole();

    expect(await queryByText("Clock.cy.js")).not.toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Running Cypress:")).toBeInTheConsole();
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
