const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    trashAssetsBeforeRuns: false,
    specPattern: "./cypress/e2e/1-getting-started/",
    setupNodeEvents(on, config) {
      // on("before:run", (details) => {
      //   console.log(details);
      // });
      require("@bahmutov/cy-grep/src/plugin")(config);
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
      // implement node event listeners here
    },
  },

  component: {
    specPattern: "./src/components/",
  },
});
