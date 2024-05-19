import { ESLintUtils, TSESTree, TSESLint, ParserServices } from "@typescript-eslint/utils";
import ts from "typescript";

export const makeRule = ESLintUtils.RuleCreator(name => {
	return name;
});

type ExtractStringMembers<T> = Extract<T[keyof T], string>;

export const robloxTSSettings = (o: {
	[K in ExtractStringMembers<typeof import("../rules")>]: "error" | "warn" | "off";
}) => {
	const settings: {
		[K: string]: "error" | "warn" | "off";
	} = {};

	for (const [name, setting] of Object.entries(o)) {
		settings[`roblox-ts/${name}`] = setting;
	}

	return settings;
};

export type ExpressionWithTest =
	| TSESTree.ConditionalExpression
	| TSESTree.DoWhileStatement
	| TSESTree.ForStatement
	| TSESTree.IfStatement
	| TSESTree.WhileStatement;

/**
 * Resolves the given node's type. Will resolve to the type's generic constraint, if it has one.
 */
export function getConstrainedTypeAtLocation(checker: ts.TypeChecker, node: ts.Node): ts.Type {
	const nodeType = checker.getTypeAtLocation(node);
	return checker.getBaseConstraintOfType(nodeType) || nodeType;
}

export function getConstrainedType(service: Required<ParserServices>, checker: ts.TypeChecker, node: TSESTree.Node) {
	return getConstrainedTypeAtLocation(checker, service.esTreeNodeToTSNodeMap.get(node));
}
