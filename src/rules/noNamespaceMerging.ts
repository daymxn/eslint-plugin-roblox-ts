import ts from "typescript";
import { makeRule } from "../util/rules";
import { ESLintUtils } from "@typescript-eslint/utils";

function isDeclarationOfNamespace(declaration: ts.Declaration) {
	if (ts.isModuleDeclaration(declaration) && ts.isInstantiatedModule(declaration, false)) {
		return true;
	} else if (ts.isFunctionDeclaration(declaration) && declaration.body) {
		return true;
	}
	return false;
}

function hasMultipleInstantiations(symbol: ts.Symbol): boolean {
	let amtValueDeclarations = 0;
	for (const declaration of symbol.declarations ?? []) {
		if (isDeclarationOfNamespace(declaration)) {
			amtValueDeclarations++;
			if (amtValueDeclarations > 1) {
				return true;
			}
		}
	}
	return false;
}

export const noNamespaceMergingName = "no-namespace-merging";
export const noNamespaceMerging = makeRule<[], "namespaceMergingViolation">({
	name: noNamespaceMergingName,
	meta: {
		type: "problem",
		docs: {
			description: "Bans namespace declaration merging",
			recommended: "recommended",
			requiresTypeChecking: true,
		},
		messages: {
			namespaceMergingViolation: "Namespace merging is not supported!",
		},
		schema: [],
	},
	defaultOptions: [],
	create(context) {
		const service = ESLintUtils.getParserServices(context);
		const checker = service.program.getTypeChecker();

		return {
			TSModuleDeclaration(node) {
				const tsNode = service.esTreeNodeToTSNodeMap.get(node);

				if (ts.isInstantiatedModule(tsNode, false)) {
					const symbol = checker.getSymbolAtLocation(tsNode.name);
					if (symbol && hasMultipleInstantiations(symbol)) {
						context.report({
							node: node.id,
							messageId: "namespaceMergingViolation",
						});
					}
				}
			},
		};
	},
});
