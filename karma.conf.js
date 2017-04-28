module.exports = function(config) {
    config.set({

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

        browsers: ["Chrome"]
    });
};
