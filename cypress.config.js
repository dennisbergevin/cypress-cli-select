const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    trashAssetsBeforeRuns: false,
    setupNodeEvents(on, config) {
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
