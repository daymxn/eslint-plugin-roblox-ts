import { makeRule } from "../util/rules";

export const noGlobalThisName = "no-global-this";
export const noGlobalThis = makeRule<[], "globalThisViolation">({
	name: noGlobalThisName,
	meta: {
		type: "problem",
		docs: {
			description: "Bans globalThis from being used",
			recommended: true,
			requiresTypeChecking: false,
		},
		messages: {
			globalThisViolation: "`globalThis` is not supported!",
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		return {
			Identifier(node) {
				if (node.name === "globalThis") {
					context.report({
						node: node,
						messageId: "globalThisViolation",
					});
				}
			},
		};
	},
});
