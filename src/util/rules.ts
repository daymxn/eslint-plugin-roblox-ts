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
 * Try to retrieve typescript parser service from context.
 */
export function getParserServices<TMessageIds extends string, TOptions extends Array<unknown>>(
	context: TSESLint.RuleContext<TMessageIds, TOptions>,
): Required<ParserServices> {
	const { parserServices } = context.sourceCode;
	if (!parserServices?.program || !parserServices.esTreeNodeToTSNodeMap) {
		/**
		 * The user needs to have configured "project" in their parserOptions
		 * for @typescript-eslint/parser
		 */
		throw new Error(
			'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.',
		);
	}

	return parserServices as Required<ParserServices>;
}

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
