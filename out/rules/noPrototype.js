"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noPrototype = exports.noPrototypeName = void 0;
const typescript_1 = __importDefault(require("typescript"));
const rules_1 = require("../util/rules");
const utils_1 = require("@typescript-eslint/utils");
exports.noPrototypeName = "no-prototype";
exports.noPrototype = (0, rules_1.makeRule)({
    name: exports.noPrototypeName,
    meta: {
        type: "problem",
        docs: {
            description: "Bans prototype from being used",
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            prototypeViolation: "`prototype` is not supported!",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const service = utils_1.ESLintUtils.getParserServices(context);
        return {
            MemberExpression(node) {
                const tsNode = service.esTreeNodeToTSNodeMap.get(node);
                if (typescript_1.default.isPrototypeAccess(tsNode)) {
                    context.report({
                        node: node,
                        messageId: "prototypeViolation",
                    });
                }
            },
        };
    },
});
