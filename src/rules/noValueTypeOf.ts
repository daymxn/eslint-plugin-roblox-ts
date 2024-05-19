import { makeRule } from "../util/rules";

export const noValueTypeOfName = "no-value-typeof";
export const noValueTypeOf = makeRule<[], "typeofValueViolation">({
	name: "no-value-typeof",
	meta: {
		type: "problem",
		docs: {
			description: "Disallows the typeof operator for values",
			recommended: "recommended",
			requiresTypeChecking: false,
		},
		schema: [],
		messages: {
			typeofValueViolation:
				"'typeof' operator is not supported! Use `typeIs(value, type)` or `typeOf(value)` instead.",
		},
	},
	defaultOptions: [],
	create(context) {
		return {
			UnaryExpression(node) {
				if (node.operator === "typeof") {
					context.report({ node, messageId: "typeofValueViolation" });
				}
			},
		};
	},
});
