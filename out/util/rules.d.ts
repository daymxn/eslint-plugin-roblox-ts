import { ESLintUtils, TSESTree, ParserServices } from "@typescript-eslint/utils";
import ts from "typescript";
export interface RuleMetaData {
    recommended?: boolean;
    requiresTypeChecking?: boolean;
}
export declare const makeRule: <Options extends readonly unknown[], MessageIds extends string>({ name, meta, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<Options, MessageIds, RuleMetaData>>) => ESLintUtils.RuleModule<MessageIds, Options, RuleMetaData, ESLintUtils.RuleListener>;
export type RobloxTsRule = ReturnType<typeof makeRule>;
type ExtractStringMembers<T> = Extract<T[keyof T], string>;
export declare const robloxTSSettings: (o: { [K in ExtractStringMembers<typeof import("../rules")>]: "error" | "warn" | "off"; }) => Record<string, "off" | "error" | "warn">;
export type ExpressionWithTest = TSESTree.ConditionalExpression | TSESTree.DoWhileStatement | TSESTree.ForStatement | TSESTree.IfStatement | TSESTree.WhileStatement;
/**
 * Resolves the given node's type. Will resolve to the type's generic constraint, if it has one.
 */
export declare function getConstrainedTypeAtLocation(checker: ts.TypeChecker, node: ts.Node): ts.Type;
export declare function getConstrainedType(service: Required<ParserServices>, checker: ts.TypeChecker, node: TSESTree.Node): ts.Type;
export {};
