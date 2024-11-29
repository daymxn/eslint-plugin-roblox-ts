"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noExportAssignmentLet = exports.noExportAssignmentLetName = void 0;
const utils_1 = require("@typescript-eslint/utils");
const typescript_1 = __importDefault(require("typescript"));
const rules_1 = require("../util/rules");
exports.noExportAssignmentLetName = "no-export-assignment-let";
exports.noExportAssignmentLet = (0, rules_1.makeRule)({
    name: exports.noExportAssignmentLetName,
    meta: {
        // TODO
        type: "problem",
        docs: {
            description: "Bans using `export =` on a let variable",
            recommended: true,
            requiresTypeChecking: false,
        },
        messages: {
            noExportAssignmentLetViolation: "Cannot use `export =` on a `let` variable!",
        },
        schema: [],
    },
    defaultOptions: [],
    create(context) {
        const service = utils_1.ESLintUtils.getParserServices(context);
        return {
            TSExportAssignment(node) {
                const tsNode = service.esTreeNodeToTSNodeMap.get(node);
                const expression = tsNode.expression;
                if (typescript_1.default.isIdentifier(expression)) {
                    const variable = context.sourceCode.getScope(node).variables.find(variable => {
                        return variable.identifiers[0].name === expression.escapedText;
                    });
                    // Not sure why this works?
                    if (variable === null || variable === void 0 ? void 0 : variable.defs[0].parent) {
                        if (variable.defs[0].parent.type === utils_1.AST_NODE_TYPES.VariableDeclaration) {
                            if (variable.defs[0].parent.kind === "let") {
                                context.report({
                                    node: node,
                                    messageId: "noExportAssignmentLetViolation",
                                });
                            }
                        }
                    }
                }
            },
        };
    },
});
