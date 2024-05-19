import { makeRule } from "../util/rules";

export const noRegexName = "no-regex";
export const noRegex = makeRule<[], "regexViolation">({
	name: "no-regex",
	meta: {
		type: "problem",
		docs: {
			description: "Disallows the regex operator",
			recommended: "recommended",
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
