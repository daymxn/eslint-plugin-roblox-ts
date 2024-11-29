"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noEnumMerging = exports.noEnumMergingName = void 0;
const utils_1 = require("@typescript-eslint/utils");
const rules_1 = require("../util/rules");
exports.noEnumMergingName = "no-enum-merging";
exports.noEnumMerging = (0, rules_1.makeRule)({
    name: exports.noEnumMergingName,
    meta: {
        type: "problem",
        docs: {
            description: "Bans enum declaration merging",
            recommended: true,
            requiresTypeChecking: true,
        },
        messages: {
            enumMergingViolation: "Enum merging is not supported!",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const service = utils_1.ESLintUtils.getParserServices(context);
        const checker = service.program.getTypeChecker();
        return {
            TSEnumDeclaration(node) {
                const tsNode = service.esTreeNodeToTSNodeMap.get(node);
                const symbol = checker.getSymbolAtLocation(tsNode.name);
                if ((symbol === null || symbol === void 0 ? void 0 : symbol.declarations) && symbol.declarations.length > 1) {
                    context.report({
                        node: node.id,
                        messageId: "enumMergingViolation",
                    });
                }
            },
        };
    },
});
