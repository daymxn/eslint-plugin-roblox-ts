import ts from "typescript";
import { makeRule } from "../util/rules";
import { ESLintUtils } from "@typescript-eslint/utils";

export const noPrototypeName = "no-prototype";
export const noPrototype = makeRule<[], "prototypeViolation">({
	name: noPrototypeName,
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
		const service = ESLintUtils.getParserServices(context);
		return {
			MemberExpression(node) {
				const tsNode = service.esTreeNodeToTSNodeMap.get(node);
				if (ts.isPrototypeAccess(tsNode)) {
					context.report({
						node: node,
						messageId: "prototypeViolation",
					});
				}
			},
		};
	},
});
