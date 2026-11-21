module.exports = {
  default: {
    paths: ["e2e/features/**/*.feature"],
    require: ["e2e/support/hooks.js", "e2e/steps/frontend.steps.js"],
    format: [
      "progress",
      "html:test-results/frontend-cucumber-report.html",
      "json:test-results/frontend-cucumber-report.json",
      "junit:test-results/frontend-junit.xml",
    ],
    formatOptions: {
      snippetInterface: "async-await",
    },
    parallel: 1,
    publishQuiet: true,
  },
};
