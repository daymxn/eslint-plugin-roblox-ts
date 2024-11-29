import { TSESLint } from "@typescript-eslint/utils";
declare const rules: Record<string, TSESLint.RuleModule<string, readonly unknown[], import("./util/rules").RuleMetaData, TSESLint.RuleListener>>;
declare const configs: Record<string, {
    name: string;
    plugins: object;
    rules: Record<string, "error" | "warn" | "off">;
}>;
declare const _default: {
    rules: Record<string, TSESLint.RuleModule<string, readonly unknown[], import("./util/rules").RuleMetaData, TSESLint.RuleListener>>;
    configs: Record<string, {
        name: string;
        plugins: object;
        rules: Record<string, "error" | "warn" | "off">;
    }>;
};
export default _default;
export { rules, configs };
