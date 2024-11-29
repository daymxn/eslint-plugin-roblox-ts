"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = exports.rules = void 0;
const ruleImports = __importStar(require("./rules"));
const rules_1 = require("./util/rules");
/** We just use this for intellisense */
const makePlugin = (obj) => {
    const ruleNames = new Set();
    const { rules, configs } = obj;
    for (const ruleName in rules) {
        ruleNames.add(ruleName);
    }
    for (const configName in configs) {
        for (const ruleName in configs[configName].rules) {
            if (ruleName.startsWith("roblox-ts/") && !ruleNames.has(ruleName.slice(10))) {
                throw new Error(`${ruleName} is not a valid rule defined in eslint-plugin-roblox-ts! Try one of the following: ` +
                    [...ruleNames].join(", "));
            }
        }
    }
    return obj;
};
function getRules() {
    const rules = {};
    for (const [i, ruleName] of Object.entries(ruleImports).filter(t => t[0].endsWith("Name"))) {
        rules[ruleName] = ruleImports[i.slice(0, -4)];
    }
    return rules;
}
const rules = getRules();
exports.rules = rules;
const plugin = makePlugin({
    rules: rules,
    configs: {
        recommended: {
            name: "roblox-ts/recommended",
            plugins: {
                ["roblox-ts"]: {
                    rules: rules,
                },
            },
            rules: {
                ...(0, rules_1.robloxTSSettings)({
                    "no-any": "off",
                    "no-enum-merging": "error",
                    "no-for-in": "error",
                    "no-function-expression-id": "error",
                    "no-getters-or-setters": "error",
                    "no-global-this": "error",
                    "no-namespace-merging": "error",
                    "no-null": "error",
                    "no-object-math": "error",
                    "no-prototype": "error",
                    "no-rbx-postfix-new": "error",
                    "no-regex": "error",
                    "no-value-typeof": "error",
                    "no-private-identifier": "error",
                    "no-spread-destructuring": "error",
                    "no-export-assignment-let": "error",
                    "no-preceding-spread-element": "error",
                    "misleading-luatuple-checks": "warn",
                    "lua-truthiness": "warn",
                    "no-array-pairs": "warn",
                }),
                "no-debugger": "error",
                "no-labels": "error",
                "no-sequences": "error",
                "no-sparse-arrays": "warn",
                "no-var": "error",
                "no-void": "error",
                "no-with": "error",
                "prefer-rest-params": "error", // disables `arguments`
                eqeqeq: "error",
                // @typescript-eslint
                "@typescript-eslint/ban-types": "off",
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/no-array-constructor": "off",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-empty-interface": "off",
                "@typescript-eslint/no-namespace": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-var-requires": "off",
            },
        },
    },
});
const configs = plugin.configs;
exports.configs = configs;
exports.default = {
    rules,
    configs,
};