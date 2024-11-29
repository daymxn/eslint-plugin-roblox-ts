"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noRegex = exports.noRegexName = void 0;
const rules_1 = require("../util/rules");
exports.noRegexName = "no-regex";
exports.noRegex = (0, rules_1.makeRule)({
    name: "no-regex",
    meta: {
        type: "problem",
        docs: {
            description: "Disallows the regex operator",
            recommended: true,
            requiresTypeChecking: false,
        },
        schema: [],
        messages: {
            regexViolation: "Regex literals are not supported.",
        },
    },
    defaultOptions: [],
    create(context) {
        const sourceCode = context.sourceCode;
        return {
            Literal(node) {
                const token = sourceCode.getFirstToken(node);
                if (token && token.type === "RegularExpression") {
                    context.report({
                        node,
                        messageId: "regexViolation",
                    });
                }
            },
        };
    },
});
