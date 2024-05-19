import { makeRule } from "../util/rules";

export const noNullName = "no-null";
export const noNull = makeRule<[], "nullViolation">({
	name: noNullName,
	meta: {
		type: "problem",
		docs: {
			description: "Bans null from being used",
			recommended: "recommended",
			requiresTypeChecking: false,
		},
		fixable: "code",
		messages: {
			nullViolation: "Do not use null. Use undefined instead",
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		return {
			TSNullKeyword(node) {
				context.report({
					node: node,
					messageId: "nullViolation",
					fix: fixer => fixer.replaceText(node, "undefined"),
				});
			},

			Literal(node) {
				if (node.value === null) {
					context.report({
						node: node,
						messageId: "nullViolation",
						fix: fixer => fixer.replaceText(node, "undefined"),
					});
				}
			},
		};
	},
});
