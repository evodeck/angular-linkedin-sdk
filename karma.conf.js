module.exports = function (config) {
    var configuration = {
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { pattern: "base.spec.ts" },
            { pattern: "src/**/*.+(ts|html)" }
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },
        karmaTypescriptConfig: {
            exclude: ["node_modules", "dist", "demo"],
            bundlerOptions: {
                entrypoints: /\.spec\.ts$/,
                transforms: [
                    require("karma-typescript-angular2-transform")
                ]
            },
            compilerOptions: {
                lib: ["ES2015", "DOM"]
            },
            coverageOptions: {
                instrumentation: true
            }
        },
        reporters: ["spec", "karma-typescript"],
        browsers: ["Chrome"],
        customLaunchers: {
            Chrome_travis_ci: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        }
    };
    if (process.env.TRAVIS) {
        // Codecov
        configuration.coverageReporter = {
            type: 'lcov',
            dir: 'coverage/'
        };
        configuration.karmaTypescriptConfig.reports = {
            "lcovonly": {
                "directory": "coverage",
                "filename": "lcovonly/lcov.info"
            }
        };
        // Travis CI
        configuration.browsers = ['Chrome_travis_ci'];
        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        configuration.singleRun = true;
    }
    config.set(configuration);
};
