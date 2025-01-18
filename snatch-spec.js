#!/usr/bin/env node

const { getSpecs } = require("find-cypress-specs");
const cypress = require("cypress");
const Fuse = require("fuse.js");
const { select } = require("inquirer-select-pro");
const { getTestNames } = require("find-test-names");
const { sortingList } = require("./src/sortable-list");
const yarg = require("yargs");
const pc = require("picocolors");
const fs = require("fs");
const path = require("path");

// Used when walking the getTestNames array of objects with nested suites
// Grabs spec name, parent suite names, and test title
function iterateObject(obj, arr, continuedArr) {
  if (obj.tests.length > 0) {
    if (obj.tests.length === 1 && obj.suites.length === 0) {
      obj.tests.forEach((test) => {
        arr[arr.length - 1].push(test.name);
      });
    } else {
      obj.tests.forEach((test) => {
        let newArr = [...continuedArr, test.name];
        arr.push(newArr);
      });
    }
  }
  if (obj.suites.length > 0) {
    obj.suites.forEach((suite) => {
      let newArr = [...continuedArr, suite.name];
      arr.push(newArr);
      iterateObject(suite, arr, newArr);
    });
  }
}

// Used to remove a process argument before executing Cypress run
function findAndRemoveArgv(arg) {
  const argToRemove = arg;
  const index = process.argv.indexOf(argToRemove);
  if (index > -1) {
    process.argv.splice(index, 1); // Remove the argument
  }
}

// Retrieves Cypress spec files using getSpecs
// For each spec file, use getTestNames to walk the test array of objects
const suitesTests = () => {
  const specs = getSpecs(
    process.env.CYPRESS_CONFIG_FILE,
    process.env.TESTING_TYPE,
    false,
  );
  let arr = [];

  specs.forEach((element) => {
    const source = fs.readFileSync(element, "utf8");
    const tests = getTestNames(source, true);
    const specFile = path.basename(element);

    tests.structure.forEach((struct) => {
      const baseDepthArr = [`${specFile}`, `${struct.name}`];
      arr.push(baseDepthArr);

      iterateObject(struct, arr, baseDepthArr);
    });
  });

  return arr;
};

async function runSelectedSpecs() {
  console.log("\n");
  console.log(pc.bgGreen(pc.black(pc.bold(` Cypress-cli-select `))));
  console.log("\n");

  yarg
    .completion("--print-selected", false)
    .option("print-selected", {
      desc: "Prints selected spec(s) and test(s)",
      type: "boolean",
    })
    .example("npx cypress-cli-select run --print-selected");

  yarg
    .completion("--choose-spec-pattern", false)
    .option("choose-spec-pattern", {
      desc: "Uses specPattern to enable spec ordering",
      type: "boolean",
    })
    .example("npx cypress-cli-select run --component --choose-spec-pattern");

  yarg
    .scriptName("npx cypress-cli-select run")
    .usage(
      "An interactive cli interface to select Cypress spec(s) and test(s) to run\n",
    )
    .usage("$0 [args]")
    .example("npx cypress-cli-select run --browser=firefox --retries=2")
    .help().argv;

  if (process.argv.includes("--component")) {
    process.env.TESTING_TYPE = "component";
  } else {
    process.env.TESTING_TYPE = "e2e";
  }

  // Prompt for use to select spec and/or test titles option
  const specAndTestPrompt = await select({
    message: "Choose to filter by specs and/or specific test titles",
    multiple: true,
    canToggleAll: true,
    options: [
      {
        name: "Specs",
        value: "Specs",
      },
      {
        name: "Test titles (requires cy-grep)",
        value: "Tests",
      },
    ],
    required: true,
  });

  // Arrays for storing specs and/or tests selectedTests
  // If user passes --print-selected
  const specArr = [];
  const testArr = [];

  if (specAndTestPrompt.includes("Specs")) {
    const specs = getSpecs(
      process.env.CYPRESS_CONFIG_FILE,
      process.env.TESTING_TYPE,
      false,
    );

    if (specs.length > 0) {
      function specsChoices() {
        let arr = [];
        specs.forEach((element) => {
          const spec = {
            name: element,
            value: element,
          };
          arr.push(spec);
        });
        return arr;
      }

      const specSelections = await select({
        message: "Select specs to run",
        multiple: true,
        canToggleAll: true,
        clearInputWhenSelected: true,
        options: (input = "") => {
          const specs = specsChoices();

          const fuse = new Fuse(specs, {
            keys: ["value"],
          });

          if (!input) return specs;
          if (fuse) {
            const result = fuse.search(input).map(({ item }) => item);
            return result;
          }
          return [];
        },
      });

      // If user passes --print-selected, print the specs selected
      specSelections.forEach((spec) => {
        specArr.push(`${spec}`);
      });

      if (process.argv.includes("--choose-spec-pattern")) {
        findAndRemoveArgv("--choose-spec-pattern");
        const sortedSpecResult = await sortingList({
          message: "Reorder the specs in desired run order:",
          choices: specSelections,
        });

        // If user passes --print-selected, empty array storing specs and print re-ordered
        specArr.length = 0;

        sortedSpecResult.forEach((spec) => {
          specArr.push(`${spec}`);
        });

        if (specAndTestPrompt.includes("Tests")) {
          // For more info on grepExtraSpecs: https://github.com/bahmutov/cy-grep?tab=readme-ov-file#grepextraspecs
          process.env.CYPRESS_grepExtraSpecs = sortedSpecResult.toString();
        } else {
          // Translate to specPattern string format to be used for Cypress run command line
          function specString() {
            let stringedSpecs = "";
            sortedSpecResult.forEach((spec) => {
              specArr.push(`"${spec}"`);
              stringedSpecs += `"${spec}", `;
            });
            return stringedSpecs.slice(0, -2);
          }
          if (process.env.TESTING_TYPE === "e2e") {
            process.argv.push("--config");
            process.argv.push(`specPattern=[${specString()}]`);
          } else {
            // TODO: Current component test specPattern workaround
            // See: https://github.com/cypress-io/cypress/issues/29317
            process.argv.push("--config");
            process.argv.push(
              `{ "component": { "specPattern": [${specString()}] }}`,
            );
          }
        }
      } else {
        if (specAndTestPrompt.includes("Tests")) {
          process.env.CYPRESS_grepExtraSpecs = specSelections.toString();
        } else {
          process.argv.push(`--spec`);
          process.argv.push(`${specSelections.join().toString()}`);
        }
      }
    } else {
      console.log("\n");
      console.log(
        pc.bgRed(
          pc.white(pc.bold(` No ${process.env.TESTING_TYPE} specs found `)),
        ),
      );
      process.exit();
    }
  }

  if (specAndTestPrompt.includes("Tests")) {
    const specs = getSpecs(
      process.env.CYPRESS_CONFIG_FILE,
      process.env.TESTING_TYPE,
      false,
    );

    if (specs.length > 0) {
      const testChoices = () => {
        const tests = suitesTests();
        let arr = [];
        tests.forEach((element) => {
          if (element.length === 2) {
            const spec = {
              spec: element.shift(),
              parent: element.pop(),
            };
            arr.push(spec);
          } else {
            const spec = {
              spec: element.shift(),
              parent: element,
              test: element.pop(),
            };
            arr.push(spec);
          }
        });
        return arr;
      };

      // Sets up the test select prompt formatted spec > parent(s) > test
      // All selected tests will then remove the ">" separator for use in @bahmutov/cy-grep to run test titles
      const separateStringJson = () => {
        let arr = [];
        const specs = testChoices();
        specs.forEach((element) => {
          const { spec, ...specLess } = element;
          const choices = {
            name: Object.values(element).flat().join(" > "),
            value: {
              grepString: Object.values(specLess).flat().join(" "),
              printArr: element,
            },
          };
          arr.push(choices);
        });
        return arr;
      };

      const selectedTests = await select({
        message: "Select tests to run",
        multiple: true,
        required: true,
        clearInputWhenSelected: true,
        options: (input = "") => {
          const tests = separateStringJson();

          const fuse = new Fuse(tests, {
            keys: ["name"],
          });

          if (!input) return tests;
          if (fuse) {
            const result = fuse.search(input).map(({ item }) => item);
            return result;
          }
          return [];
        },
      });

      // Format the tests selected into a string separated by colon
      // This is the test title grep string format used by @bahmutov/cy-grep package
      function formatGrepString() {
        let stringedTests = "";
        selectedTests.forEach((test) => {
          testArr.push(test.printArr);
          stringedTests += `${test.grepString}; `;
        });
        return stringedTests.slice(0, -2);
      }

      const stringedTests = formatGrepString();

      // Set the process.env for @bahmutov/cy-grep package using CYPRESS_*
      process.env.CYPRESS_grep = `${stringedTests}`;
      process.env.CYPRESS_grepFilterSpecs = true;
      process.env.CYPRESS_grepOmitFiltered = true;
    } else {
      console.log("\n");
      console.log(
        pc.bgRed(
          pc.white(pc.bold(` No ${process.env.TESTING_TYPE} specs found `)),
        ),
      );
      process.exit();
    }
  }

  if (process.argv.includes("--print-selected")) {
    if (specAndTestPrompt.includes("Specs")) {
      console.log("\n");
      console.log(pc.bgGreen(pc.black(pc.bold(` Spec(s) selected: `))));
      console.log(specArr);
    }
    if (specAndTestPrompt.includes("Tests")) {
      console.log("\n");
      console.log(pc.bgGreen(pc.black(pc.bold(` Test(s) selected: `))));
      console.log(testArr);
    }
    process.exit();
  } else {
    console.log("\n");
    console.log(pc.bgGreen(pc.black(pc.bold(` Running Cypress: `))));
    const runOptions = await cypress.cli.parseRunArguments(
      process.argv.slice(2),
    );
    await cypress.run(runOptions);
  }
}

runSelectedSpecs();
