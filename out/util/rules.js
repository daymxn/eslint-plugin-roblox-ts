"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.robloxTSSettings = exports.makeRule = void 0;
exports.getConstrainedTypeAtLocation = getConstrainedTypeAtLocation;
exports.getConstrainedType = getConstrainedType;
const utils_1 = require("@typescript-eslint/utils");
exports.makeRule = utils_1.ESLintUtils.RuleCreator(name => {
    return `https://github.com/roblox-ts/eslint-plugin-roblox-ts/tree/master/src/rules/${name}.ts`;
});
const robloxTSSettings = (o) => {
    const settings = {};
    for (const [name, setting] of Object.entries(o)) {
        settings[`roblox-ts/${name}`] = setting;
    }
    return settings;
};
exports.robloxTSSettings = robloxTSSettings;
/**
 * Resolves the given node's type. Will resolve to the type's generic constraint, if it has one.
 */
function getConstrainedTypeAtLocation(checker, node) {
    const nodeType = checker.getTypeAtLocation(node);
    return checker.getBaseConstraintOfType(nodeType) || nodeType;
}
function getConstrainedType(service, checker, node) {
    return getConstrainedTypeAtLocation(checker, service.esTreeNodeToTSNodeMap.get(node));
}
