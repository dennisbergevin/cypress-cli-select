#!/usr/bin/env node

const { getSpecs, getTests } = require("find-cypress-specs");
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
function iterateObject(obj, arr, continuedArr, tagsArr) {
  if (obj.tests.length > 0) {
    obj.tests.forEach((test) => {
      collectTags(tagsArr, test.tags, test.requiredTags);
      let newArr = [...continuedArr, test.name];
      arr.push(newArr);
    });
  }
  if (obj.suites.length > 0) {
    obj.suites.forEach((suite) => {
      collectTags(tagsArr, suite.tags, suite.requiredTags);
      let newArr = [...continuedArr, suite.name];
      iterateObject(suite, arr, newArr, tagsArr);
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

// Collect tags and requiredTags within suites and tests
function collectTags(arr, tags, requiredTags) {
  if (tags) {
    if (Array.isArray(tags)) {
      tags.forEach((tag) => {
        // filter out duplicates
        arr.indexOf(tag) === -1 ? arr.push(tag) : null;
      });
    } else {
      arr.indexOf(tags) === -1 ? arr.push(tags) : null;
    }
  }

  if (requiredTags) {
    if (Array.isArray(requiredTags)) {
      requiredTags.forEach((requiredTag) => {
        arr.indexOf(requiredTag) === -1 ? arr.push(requiredTag) : null;
      });
    } else {
      arr.indexOf(requiredTags) === -1 ? arr.push(requiredTags) : null;
    }
  }
}

// Retrieves Cypress spec files using getSpecs
// For each spec file, use getTestNames to walk the test array of objects
const suitesTests = (justTags) => {
  const specs = getSpecs(undefined, process.env.TESTING_TYPE, false);

  let arr = [];
  let tagArr = [];

  specs.forEach((element) => {
    const source = fs.readFileSync(element, "utf8");
    const tests = getTestNames(source, true);
    const specFile = path.basename(element);

    tests.structure.forEach((struct) => {
      const baseDepthArr = [`${specFile}`, `${struct.name}`];
      if (
        struct.type === "test" &&
        struct.pending === false &&
        !struct.exclusive
      ) {
        arr.push(baseDepthArr);
      }

      collectTags(tagArr, struct.tags, struct.requiredTags);
      // only walk nested structure for suites
      if (struct.type != "test") {
        iterateObject(struct, arr, baseDepthArr, tagArr);
      }
    });
  });

  if (justTags) {
    return tagArr;
  } else {
    return arr;
  }
};

async function runSelectedSpecs() {
  if (process.argv.includes("--config-file")) {
    const index = process.argv.indexOf("--config-file");
    process.env.CYPRESS_CONFIG_FILE = process.argv[index + 1];
  }

  if (process.argv.includes("--submit-focused")) {
    findAndRemoveArgv("--submit-focused");
    process.env.SUBMIT_FOCUSED = true;
  }

  try {
    yarg
      .completion("--print-selected", false)
      .option("print-selected", {
        desc: "Prints selected specs, tests or tags",
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
      .completion("--submit-focused", false)
      .option("submit-focused", {
        desc: "Selects and submits focused item using enter",
        type: "boolean",
      })
      .example("npx cypress-cli-select run --submit-focused");

    yarg
      .scriptName("npx cypress-cli-select run")
      .usage(
        "\nInteractive cli prompts to select Cypress specs, tests or tags run\n",
      )
      .usage("$0 [args]")
      .example("npx cypress-cli-select run --browser=firefox")
      .help().argv;

    if (process.argv.includes("--component")) {
      process.env.TESTING_TYPE = "component";
    } else {
      process.env.TESTING_TYPE = "e2e";
    }

    // Cypress-cli-select title
    console.log("\n");
    console.log(pc.bgGreen(pc.black(pc.bold(` Cypress-cli-select `))));
    console.log("\n");

    // Prompt for use to select spec and test titles or tags option
    const specAndTestPrompt = await select({
      message: "Choose to filter by specs, specific test titles or tags: ",
      multiple: true,
      clearInputWhenSelected: true,
      selectFocusedOnSubmit: process.env.SUBMIT_FOCUSED,
      canToggleAll: true,
      options: [
        {
          name: "Specs",
          value: "Specs",
        },
        {
          name: "Test titles or tags (requires cy-grep)",
          value: "Tests or tags",
        },
      ],
      required: true,
    });

    if (specAndTestPrompt.includes("Tests or tags")) {
      // Prompt for use to select test titles or tags option
      const titleOrTagPrompt = await select({
        message: "Choose to filter by specific test titles or tags: ",
        multiple: false,
        selectFocusedOnSubmit: process.env.SUBMIT_FOCUSED,
        options: [
          {
            name: "Test titles (requires cy-grep)",
            value: "Titles",
          },
          {
            name: "Test tags (requires cy-grep)",
            value: "Tags",
          },
        ],
        required: true,
      });
      process.env.CY_GREP_FILTER_METHOD = titleOrTagPrompt;
    }

    // Arrays for storing specs and/or tests
    // If user passes --print-selected
    const specArr = [];
    const testArr = [];

    if (specAndTestPrompt.includes("Specs")) {
      const specs = getSpecs(undefined, process.env.TESTING_TYPE, false);

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
          message: "Select specs to run:",
          multiple: true,
          required: true,
          clearInputWhenSelected: true,
          selectFocusedOnSubmit: process.env.SUBMIT_FOCUSED,
          canToggleAll: true,
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

          if (process.env.CY_GREP_FILTER_METHOD) {
            // For more info on grepExtraSpecs: https://github.com/bahmutov/cy-grep?tab=readme-ov-file#grepextraspecs
            process.env.CYPRESS_grepExtraSpecs = sortedSpecResult.toString();
          } else {
            // Translate to specPattern string format to be used for Cypress run command line
            function specString() {
              let stringedSpecs = "";
              sortedSpecResult.forEach((spec) => {
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
          if (process.env.CY_GREP_FILTER_METHOD) {
            process.env.CYPRESS_grepExtraSpecs = specSelections.toString();
          } else {
            process.argv.push(`--spec`);
            process.argv.push(`${specSelections.join().toString()}`);
          }
        }
      } else {
        console.log("\n");
        console.log(
          pc.redBright(pc.bold(` No ${process.env.TESTING_TYPE} specs found `)),
        );
        process.exit();
      }
    }

    if (process.env.CY_GREP_FILTER_METHOD === "Titles") {
      const specs = getSpecs(undefined, process.env.TESTING_TYPE, false);

      if (specs.length > 0) {
        const testChoices = () => {
          const tests = suitesTests(false);
          let arr = [];
          tests.forEach((element) => {
            if (element.length === 2) {
              const spec = {
                spec: element.shift(),
                test: element.pop(),
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
          message: "Select tests to run:",
          multiple: true,
          clearInputWhenSelected: true,
          selectFocusedOnSubmit: process.env.SUBMIT_FOCUSED,
          required: true,
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

        // find any tests that aren't selected but include selected
        // filter to an array where we can invert grep to not run
        const allTests = separateStringJson();
        const testsToInvert = [];
        selectedTests.forEach((test) => {
          const testStr = test.grepString;
          testsToInvert.push(
            allTests
              .filter(
                (test) =>
                  test.value.grepString.includes(testStr) &&
                  test.value.grepString !== testStr,
              )
              .map((t) => t.value.grepString),
          );
        });

        // Format the tests selected into a string separated by colon
        // This is the test title grep string format used by @bahmutov/cy-grep package
        function formatGrepString() {
          let stringedTests = "";
          selectedTests.forEach((test) => {
            testArr.push(test.printArr);
            stringedTests += `${test.grepString}; `;
          });
          testsToInvert.flat().forEach((test) => {
            stringedTests += `-${test}; `;
          });
          return stringedTests.slice(0, -2);
        }

        const stringedTests = formatGrepString();

        // Set the process.env for @bahmutov/cy-grep package using CYPRESS_*
        process.env.CYPRESS_grep = `${stringedTests}`;
      } else {
        console.log("\n");
        console.log(
          pc.redBright(pc.bold(` No ${process.env.TESTING_TYPE} specs found `)),
        );
        process.exit();
      }
    }

    if (process.env.CY_GREP_FILTER_METHOD === "Tags") {
      const specs = getSpecs(undefined, process.env.TESTING_TYPE, false);

      if (specs.length > 0) {
        const allTags = suitesTests(true);
        if (allTags.length > 0) {
          const separateStringJson = () => {
            let arr = [];
            allTags.forEach((element) => {
              const choices = {
                name: element,
                value: element,
              };
              arr.push(choices);
            });
            return arr;
          };

          const selectedTags = await select({
            message: "Select tags to run:",
            multiple: true,
            clearInputWhenSelected: true,
            selectFocusedOnSubmit: process.env.SUBMIT_FOCUSED,
            required: true,
            options: (input = "") => {
              const tags = separateStringJson();

              const fuse = new Fuse(tags, {
                keys: ["name"],
              });

              if (!input) return tags;
              if (fuse) {
                const result = fuse.search(input).map(({ item }) => item);
                return result;
              }
              return [];
            },
          });

          process.env.SELECTED_TAGS = selectedTags;

          // This is the tag grep string format used by @bahmutov/cy-grep package
          // Set the process.env for @bahmutov/cy-grep package using CYPRESS_*
          process.env.CYPRESS_grepTags = `${process.env.SELECTED_TAGS}`;
        } else {
          console.log("\n");
          console.log(
            pc.redBright(
              pc.bold(` No ${process.env.TESTING_TYPE} tags found `),
            ),
          );
          process.exit();
        }
      } else {
        console.log("\n");
        console.log(
          pc.redBright(pc.bold(` No ${process.env.TESTING_TYPE} specs found `)),
        );
        process.exit();
      }
    }

    if (process.argv.includes("--print-selected")) {
      findAndRemoveArgv("--print-selected");
      if (specAndTestPrompt.includes("Specs")) {
        console.log("\n");
        console.log(pc.bgGreen(pc.black(pc.bold(` Spec(s) selected: `))));
        console.log("\n");
        console.log(specArr);
      }
      if (process.env.CY_GREP_FILTER_METHOD === "Titles") {
        console.log("\n");
        console.log(pc.bgGreen(pc.black(pc.bold(` Test(s) selected: `))));
        console.log("\n");
        console.log(testArr);
      }
      if (process.env.CY_GREP_FILTER_METHOD === "Tags") {
        console.log("\n");
        console.log(pc.bgGreen(pc.black(pc.bold(` Tag(s) selected: `))));
        console.log("\n");
        console.log(process.env.SELECTED_TAGS);
      }
    }

    if (process.env.CY_GREP_FILTER_METHOD) {
      if (process.env.TESTING_TYPE === "component") {
        process.argv.push("--env");
        process.argv.push("grepOmitFiltered=true,grepFilterSpecs=true");
      } else {
        process.env.CYPRESS_grepFilterSpecs = true;
        process.env.CYPRESS_grepOmitFiltered = true;
      }
    }

    // In case the user passes this option without selecting specs
    if (process.argv.includes("--choose-spec-pattern")) {
      findAndRemoveArgv("--choose-spec-pattern");
    }
  } catch (e) {
    if (e.message.includes("User force closed the prompt")) {
      console.log("\n");
      console.log(pc.redBright(pc.bold("The prompt was closed")));
      process.exit();
    } else {
      console.log(e);
      process.exit();
    }
  }

  console.log("\n");
  console.log(pc.bgGreen(pc.black(pc.bold(` Running Cypress: `))));

  // Executing the cypress run
  const runOptions = await cypress.cli.parseRunArguments(process.argv.slice(2));
  await cypress.run(runOptions);
}

runSelectedSpecs();
