import ts from "typescript";
import { getConstrainedTypeAtLocation, getParserServices, makeRule } from "../util/rules";

const dataTypes = [
	"CFrameConstructor",
	"UDimConstructor",
	"UDim2Constructor",
	"Vector2Constructor",
	"Vector2int16Constructor",
	"Vector3Constructor",
	"Vector3int16Constructor",
];

type ViolationType = "newViolation";

export const noRbxPostFixNewName = "no-rbx-postfix-new";
export const noRbxPostFixNew = makeRule<[], ViolationType>({
	name: noRbxPostFixNewName,
	meta: {
		type: "problem",
		docs: {
			description: "Bans calling .new() on Roblox objects (helps transition to TS)",
			recommended: "recommended",
			requiresTypeChecking: true,
		},
		fixable: "code",
		messages: {
			newViolation: "Do not use `.new` use `new X()` instead.",
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const service = getParserServices(context);
		const checker = service.program?.getTypeChecker();
		if (!checker) return {};

		return {
			CallExpression(node) {
				const propertyAccess = service.esTreeNodeToTSNodeMap.get(node.callee);
				if (ts.isPropertyAccessExpression(propertyAccess)) {
					const type = getConstrainedTypeAtLocation(checker, propertyAccess.expression);
					const symbol = type.getSymbol();
					if (symbol && dataTypes.includes(symbol.getName()) && propertyAccess.name.text === "new") {
						return context.report({
							node,
							messageId: "newViolation",
							fix: fix => [
								fix.removeRange([node.callee.range[1] - 4, node.callee.range[1]]),
								fix.insertTextBefore(node, "new "),
							],
						});
					}
				}
			},
		};
	},
});
