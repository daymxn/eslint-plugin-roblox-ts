import { ESLintUtils } from "@typescript-eslint/utils";
type ViolationType = "addViolation" | "subViolation" | "mulViolation" | "divViolation" | "otherViolation";
export declare const noObjectMathName = "no-object-math";
export declare const noObjectMath: ESLintUtils.RuleModule<ViolationType, [], import("../util/rules").RuleMetaData, ESLintUtils.RuleListener>;
export {};
