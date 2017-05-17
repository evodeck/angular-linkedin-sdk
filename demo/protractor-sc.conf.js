// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

var configuration = {
  allScriptsTimeout: 11000,
  sauceUser: 'User',
  sauceKey: 'Key',
  specs: [
    './tsc/*.e2e-spec.js'
  ],
  baseUrl: 'http://localhost:4000',
  multiCapabilities: [{
    'tunnel-identifier': 'Test',
    'name': 'angular-linkedin-sdk demo Firefox E2E chrome',
    'browserName': 'chrome'
  }, {
    'tunnel-identifier': 'Test',
    'name': 'angular-linkedin-sdk demo E2E firefox',
    'browserName': 'firefox'
  }, {
    'tunnel-identifier': 'Test',
    'name': 'angular-linkedin-sdk demo E2E IE11',
    'browserName': 'internet explorer'
  }],
  directConnect: false,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () { }
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
exports.config = configuration;
