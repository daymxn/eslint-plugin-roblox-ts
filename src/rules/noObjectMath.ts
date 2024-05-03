import { getConstrainedTypeAtLocation, getParserServices, makeRule } from "../util/rules";

const dataTypes = ["CFrame", "UDim", "UDim2", "Vector2", "Vector2int16", "Vector3", "Vector3int16"];
const mathOperationSymbolsToMacroNames = new Map([
	["+", "add"] as const,
	["-", "sub"] as const,
	["*", "mul"] as const,
	["/", "div"] as const,
]) as ReadonlyMap<string, string>;
const safeOperationSymbols = new Set<string>(["===", "!=="]);

type ViolationType = "addViolation" | "subViolation" | "mulViolation" | "divViolation" | "otherViolation";

export const noObjectMathName = "no-object-math";
export const noObjectMath = makeRule<[], ViolationType>({
	name: noObjectMathName,
	meta: {
		type: "problem",
		docs: {
			description: "Bans math operators from being used on data types",
			recommended: "recommended",
			requiresTypeChecking: true,
		},
		fixable: "code",
		messages: {
			addViolation: "Do not use `+` use .add() instead.",
			subViolation: "Do not use `-` use .sub() instead.",
			mulViolation: "Do not use `*` use .mul() instead.",
			divViolation: "Do not use `/` use .div() instead.",
			otherViolation: "Cannot use this operator on a Roblox Data type.",
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const service = getParserServices(context);
		const checker = service.program?.getTypeChecker();
		if (!checker) return {};

		return {
			BinaryExpression(node) {
				const { left, right } = node;
				const tsNode = service.esTreeNodeToTSNodeMap.get(left);
				const type = getConstrainedTypeAtLocation(checker, tsNode);
				const symbol = type.getSymbol();

				if (symbol && dataTypes.includes(symbol.getName())) {
					const macroName = mathOperationSymbolsToMacroNames.get(node.operator);
					if (macroName) {
						return context.report({
							node,
							messageId: `${macroName}Violation` as ViolationType,
							fix: fix => [
								fix.replaceTextRange([left.range[1], right.range[0]], `.${macroName}(`),
								fix.insertTextAfter(right, ")"),
							],
						});
					} else if (!safeOperationSymbols.has(node.operator)) {
						return context.report({
							node,
							messageId: "otherViolation",
						});
					}
				}
			},
		};
	},
});
