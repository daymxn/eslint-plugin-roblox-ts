import { ESLintUtils } from "@typescript-eslint/experimental-utils";
import { TSESTree, AST_NODE_TYPES, ParserServices, TSESLint } from "@typescript-eslint/experimental-utils";
import ts from "typescript";

type ExpressionWithTest =
	| TSESTree.ConditionalExpression
	| TSESTree.DoWhileStatement
	| TSESTree.ForStatement
	| TSESTree.IfStatement
	| TSESTree.WhileStatement;

type RequiredParserServices = { [k in keyof ParserServices]: Exclude<ParserServices[k], undefined> };

/**
 * Try to retrieve typescript parser service from context
 */
function getParserServices<TMessageIds extends string, TOptions extends unknown[]>(
	context: TSESLint.RuleContext<TMessageIds, TOptions>,
): RequiredParserServices {
	if (!context.parserServices || !context.parserServices.program || !context.parserServices.esTreeNodeToTSNodeMap) {
		/**
		 * The user needs to have configured "project" in their parserOptions
		 * for @typescript-eslint/parser
		 */
		throw new Error(
			'You have used a rule which requires parserServices to be generated. You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.',
		);
	}
	return context.parserServices as RequiredParserServices;
}

/**
 * Resolves the given node's type. Will resolve to the type's generic constraint, if it has one.
 */
function getConstrainedTypeAtLocation(checker: ts.TypeChecker, node: ts.Node): ts.Type {
	const nodeType = checker.getTypeAtLocation(node);
	const constrained = checker.getBaseConstraintOfType(nodeType);

	return constrained || nodeType;
}

const makeRule = ESLintUtils.RuleCreator(name => name);
/** We just use this for intellisense */
const makePlugin = (obj: {
	configs: {
		[s: string]: { rules: { [a: string]: "error" | "warn" | "off" } };
	};
	rules: { [s: string]: TSESLint.RuleModule<any, any, any> };
}) => {
	for (const ruleName in obj.rules) {
		const url = obj.rules[ruleName].meta.docs.url;
		if (ruleName !== url) {
			throw new Error(`Name mismatch in eslint-plugin-roblox-ts: ${ruleName} vs ${url}`);
		}
	}
	return obj;
};

export = makePlugin({
	rules: {
		"ban-null": makeRule<[], "bannedNullMessage">({
			name: "ban-null",
			meta: {
				type: "problem",
				docs: {
					description: "Bans null from being used",
					category: "Possible Errors",
					recommended: "error",
					requiresTypeChecking: false,
				},
				fixable: "code",
				messages: {
					bannedNullMessage: "Don't use null. Use undefined instead",
				},
				schema: [],
			},
			defaultOptions: [],
			create(context) {
				return {
					TSNullKeyword(node) {
						context.report({
							node: node,
							messageId: "bannedNullMessage",
							fix: fixer => fixer.replaceText(node, "undefined"),
						});
					},

					Literal(node) {
						if (node.value === null)
							context.report({
								node: node,
								messageId: "bannedNullMessage",
								fix: fixer => fixer.replaceText(node, "undefined"),
							});
					},
				};
			},
		}),

		"misleading-luatuple-checks": makeRule<[], "bannedLuaTupleCheck" | "bannedImplicitTupleCheck">({
			name: "misleading-luatuple-checks",
			meta: {
				type: "problem",
				docs: {
					description: "Bans LuaTuples boolean expressions",
					category: "Possible Errors",
					recommended: "error",
					requiresTypeChecking: true,
				},
				schema: [],
				messages: {
					bannedLuaTupleCheck: "Unexpected LuaTuple in conditional expression. Add [0].",
					bannedImplicitTupleCheck:
						'Unexpected implicit truthy check of a Lua built-in method: A return value of 0 or "" would evaluate as false.',
				},
				fixable: "code",
			},
			defaultOptions: [],
			create(context) {
				const service = getParserServices(context);
				const checker = service.program.getTypeChecker();

				/**
				 * Determines if the node has a boolean type.
				 */
				function checkTruthy(node: TSESTree.Node) {
					const tsNode = service.esTreeNodeToTSNodeMap.get<ts.ExpressionStatement>(node);
					const type = getConstrainedTypeAtLocation(checker, tsNode);
					const symbol = type.aliasSymbol;

					if (
						ts.isElementAccessExpression(tsNode) &&
						ts.isCallExpression(tsNode.expression) &&
						ts.isPropertyAccessExpression(tsNode.expression.expression)
					) {
						const methodSymbol = checker.getSymbolAtLocation(tsNode.expression.expression.name);

						if (
							methodSymbol &&
							methodSymbol
								.getJsDocTags()
								.some(doc => doc.name === "rbxts" && doc.text === "disallow-tuple-truthy")
						) {
							return context.report({
								node,
								messageId: "bannedImplicitTupleCheck",
								fix: fix => fix.insertTextAfter(node, " !== undefined"),
							});
						}
					}

					if (symbol && symbol.escapedName === "LuaTuple") {
						return context.report({
							node,
							messageId: "bannedLuaTupleCheck",
							fix: fix => fix.insertTextAfter(node, "[0]"),
						});
					}
				}

				/**
				 * Asserts that a testable expression contains a boolean, reports otherwise.
				 * Filters all LogicalExpressions to prevent some duplicate reports.
				 */
				const containsBoolean = ({ test }: ExpressionWithTest) =>
					void (test !== null && test.type !== AST_NODE_TYPES.LogicalExpression && checkTruthy(test));

				return {
					ConditionalExpression: containsBoolean,
					DoWhileStatement: containsBoolean,
					ForStatement: containsBoolean,
					IfStatement: containsBoolean,
					WhileStatement: containsBoolean,
					LogicalExpression: node => {
						checkTruthy(node.left);
						checkTruthy(node.right);
					},
					'UnaryExpression[operator="!"]': ({ argument }: TSESTree.UnaryExpression) => checkTruthy(argument),
				};
			},
		}),

		"no-for-in": makeRule<[], "forInViolation">({
			name: "no-for-in",
			meta: {
				type: "problem",
				docs: {
					description: "Disallows iterating with a for-in loop",
					category: "Possible Errors",
					recommended: "error",
					requiresTypeChecking: false,
				},
				messages: {
					forInViolation:
						"For-in loops are forbidden because it always types the iterator variable as `string`. Use for-of or array.forEach instead.",
				},
				schema: [],
				fixable: "code",
			},
			defaultOptions: [],
			create(context) {
				return {
					ForInStatement(node) {
						context.report({
							node,
							messageId: "forInViolation",
							fix: fix => fix.replaceTextRange([node.left.range[1], node.right.range[0]], " of "),
						});
					},
				};
			},
		}),

		"no-delete": makeRule<[], "deleteViolation">({
			name: "no-delete",
			meta: {
				type: "problem",
				docs: {
					description: "Disallows the delete operator",
					category: "Possible Errors",
					recommended: "error",
					requiresTypeChecking: false,
				},
				schema: [],
				messages: {
					deleteViolation:
						"The delete operator is not supported. Please use a map instead and use map.delete()",
				},
			},
			defaultOptions: [],
			create(context) {
				return {
					UnaryExpression(node) {
						if (node.operator === "delete") {
							context.report({ node, messageId: "deleteViolation" });
						}
					},
				};
			},
		}),

		"no-regex": makeRule<[], "regexViolation">({
			name: "no-regex",
			meta: {
				type: "problem",
				docs: {
					description: "Disallows the regex operator",
					category: "Possible Errors",
					recommended: "error",
					requiresTypeChecking: false,
				},
				schema: [],
				messages: {
					regexViolation: "Regex literals are not supported.",
				},
			},
			defaultOptions: [],
			create(context) {
				const sourceCode = context.getSourceCode();
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
		}),

		"no-getters-or-setters": makeRule<[], "getterSetterViolation">({
			name: "no-getters-or-setters",
			meta: {
				type: "problem",
				docs: {
					description: "Disallows getters and setters",
					category: "Possible Errors",
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
				function checkMethodDefinition(
					node: TSESTree.ObjectExpression | TSESTree.ClassBody,
					fields: Array<TSESTree.ClassElement> | Array<TSESTree.ObjectLiteralElementLike>,
				) {
					for (const prop of fields) {
						if (prop.type === AST_NODE_TYPES.Property && (prop.kind === "get" || prop.kind === "set")) {
							context.report({
								node,
								messageId: "getterSetterViolation",
								fix: fix => fix.replaceTextRange([prop.range[0] + 3, prop.key.range[0]], ""),
							});
						}
					}
				}

				return {
					ObjectExpression: node => checkMethodDefinition(node, node.properties),
					ClassBody: node => checkMethodDefinition(node, node.body),
				};
			},
		}),
	},
	configs: {
		recommended: {
			rules: {
				"roblox-ts/ban-null": "error",
				"roblox-ts/misleading-luatuple-checks": "error",
				"roblox-ts/no-for-in": "error",
				"roblox-ts/no-delete": "error",
				"roblox-ts/no-regex": "error",
				"roblox-ts/no-getters-or-setters": "error",
				"no-void": "error",
				"no-with": "error",
				"no-debugger": "error",
				"no-labels": "error",
				eqeqeq: "error",
			},
		},
	},
});
