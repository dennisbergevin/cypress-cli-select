const { render } = require("cli-testing-library");
require("cli-testing-library/extend-expect");
const { describe, it, expect } = require("@jest/globals");
const { resolve } = require("path");

describe("component: basic input prompt flows", () => {
  it("handles spec select", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--component"],
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
    expect(await findByText("src/components/Clock.cy.js")).toBeInTheConsole();
    expect(await findByText("src/components/Stepper.cy.js")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(
      await findByText("Select specs to run: src/components/Clock.cy.js"),
    ).toBeInTheConsole();
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles test title select", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--component"],
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
      await findByText("Clock.cy.js > <Clock> > mounts"),
    ).toBeInTheConsole();
    expect(
      await findByText("Stepper.cy.js > <Stepper> > mounts"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(
      await findByText("Select tests to run: Clock.cy.js > <Clock> > mounts"),
    );
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles tag select", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--component"],
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
    expect(await findByText("@p3")).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(await findByText("Select tags to run: @p3"));
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("component: print selected displays prior to run", () => {
  it("handles spec display", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--component"],
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
    expect(await findByText("src/components/Clock.cy.js")).toBeInTheConsole();
    expect(await findByText("src/components/Stepper.cy.js")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Spec(s) selected:")).toBeInTheConsole();
    expect(
      await findByText("[ 'src/components/Clock.cy.js' ]"),
    ).toBeInTheConsole();
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles test title display", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--component"],
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
      await findByText("Clock.cy.js > <Clock> > mounts"),
    ).toBeInTheConsole();
    expect(
      await findByText("Stepper.cy.js > <Stepper> > mounts"),
    ).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(await findByText("Test(s) selected:")).toBeInTheConsole();
    expect(await findByText("spec: 'Clock.cy.js',")).toBeInTheConsole();
    expect(await findByText("parent: [ '<Clock>' ],")).toBeInTheConsole();
    expect(await findByText("mounts")).toBeInTheConsole();

    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });

  it("handles tag display", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--component"],
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
    expect(await findByText("@p3")).toBeInTheConsole();

    userEvent.keyboard("[ArrowDown]");
    userEvent.keyboard("[Enter]");

    expect(await findByText("Tag(s) selected:")).toBeInTheConsole();
    expect(await findByText("@p3")).toBeInTheConsole();
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("component: handles choose spec pattern prompt", () => {
  it("handles spec pattern", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--component"],
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
    expect(await findByText("src/components/Clock.cy.js")).toBeInTheConsole();
    expect(await findByText("src/components/Stepper.cy.js")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(
      await findByText("Reorder the specs in desired run order:"),
    ).toBeInTheConsole();
    expect(await findByText("> src/components/Clock.cy.js")).toBeInTheConsole();

    userEvent.keyboard("[Enter]");
    expect(
      await findByText(
        "Reorder the specs in desired run order: src/components/Clock.cy.js",
      ),
    ).toBeInTheConsole();
    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("component: handles prompt searching", () => {
  it("handles searching", async () => {
    const { findByText, userEvent } = await render("cd ../../../ && node", [
      resolve(__dirname, "../index.js"),
      ["--submit-focused"],
      ["--component"],
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
    expect(await findByText("src/components/Clock.cy.js")).toBeInTheConsole();
    expect(await findByText("src/components/Stepper.cy.js")).toBeInTheConsole();
    await userEvent.keyboard("Clock[Enter]", { delay: 300 });

    expect(
      await findByText("? Select specs to run: src/components/Clock.cy.js"),
    ).toBeInTheConsole();

    expect(await findByText("Running Cypress")).toBeInTheConsole();
  });
});

describe("component: accepts custom cypress config", () => {
  it("specs: passing --config-file and --component reads component specPattern", async () => {
    const { findByText, queryByText, userEvent } = await render(
      "cd ../../../ && node",
      [
        resolve(__dirname, "../index.js"),
        ["--submit-focused"],
        ["--component"],
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
    expect(await findByText("src/components/Clock.cy.js")).toBeInTheConsole();
    expect(await findByText("src/components/Stepper.cy.js")).toBeInTheConsole();

    expect(await queryByText("cypress/e2e")).not.toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Running Cypress:")).toBeInTheConsole();
  });

  it("titles: passing --config-file and --component reads component specPattern", async () => {
    const { findByText, queryByText, userEvent } = await render(
      "cd ../../../ && node",
      [
        resolve(__dirname, "../index.js"),
        ["--submit-focused"],
        ["--component"],
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
      await findByText("Clock.cy.js > <Clock> > mounts"),
    ).toBeInTheConsole();
    expect(
      await findByText("Stepper.cy.js > <Stepper> > mounts"),
    ).toBeInTheConsole();

    expect(await queryByText("cypress/e2e")).not.toBeInTheConsole();

    userEvent.keyboard("[Enter]");

    expect(await findByText("Running Cypress:")).toBeInTheConsole();
  });
});
