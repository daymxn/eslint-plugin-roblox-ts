import { TSESTree } from "@typescript-eslint/experimental-utils";
import { makeRule } from "../util/rules";

export const noGettersOrSettersName = "no-getters-or-setters";
export const noGettersOrSetters = makeRule<[], "getterSetterViolation">({
	name: noGettersOrSettersName,
	meta: {
		type: "problem",
		docs: {
			description: "Disallows getters and setters",
			recommended: "error",
			requiresTypeChecking: false,
		},
		schema: [],
		messages: {
			getterSetterViolation:
				"Getters and Setters are not supported for performance reasons. Please use a normal method instead.",
		},
		fixable: "code",
	},
	defaultOptions: [],
	create(context) {
		const checkMethodDefinition = (
			fields: Array<TSESTree.ClassElement> | Array<TSESTree.ObjectLiteralElementLike>,
		) => {
			for (const node of fields) {
				if ("kind" in node && (node.kind === "get" || node.kind === "set")) {
					context.report({
						node,
						messageId: "getterSetterViolation",
						fix: fix => fix.removeRange([node.key.range[0] - 1, node.key.range[0]]),
					});
				}
			}
		};

		return {
			ObjectExpression: node => checkMethodDefinition(node.properties),
			ClassBody: node => checkMethodDefinition(node.body),
		};
	},
});
