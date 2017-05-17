// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

var configuration = {
  allScriptsTimeout: 11000,
  specs: [
    './tsc/*.e2e-spec.js'
  ],
  baseUrl: 'http://localhost:4000',
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
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
if (process.env.TRAVIS) {
  configuration.baseUrl = 'http://linkedin-e2e.dev:4000',
  configuration.sauceBuild = process.env.TRAVIS_JOB_NUMBER;
  configuration.sauceUser = process.env.SAUCE_USERNAME;
  configuration.sauceKey = process.env.SAUCE_ACCESS_KEY;
  configuration.multiCapabilities = [{
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'angular-linkedin-sdk demo Firefox E2E chrome node v' + process.env.TRAVIS_NODE_VERSION,
    'browserName': 'chrome'
  }, {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'angular-linkedin-sdk demo E2E firefox node v' + process.env.TRAVIS_NODE_VERSION,
    'browserName': 'firefox'
  }, {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'angular-linkedin-sdk demo E2E IE11',
    'browserName': 'internet explorer'
  }];
  configuration.directConnect = false;
}
exports.config = configuration;
