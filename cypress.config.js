const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    trashAssetsBeforeRuns: false,
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
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
