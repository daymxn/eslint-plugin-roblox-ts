"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipDownwards = skipDownwards;
exports.skipUpwards = skipUpwards;
const typescript_1 = __importDefault(require("typescript"));
function skipDownwards(node) {
    while (typescript_1.default.isNonNullExpression(node) || typescript_1.default.isParenthesizedExpression(node) || typescript_1.default.isAsExpression(node)) {
        node = node.expression;
    }
    return node;
}
function skipUpwards(node) {
    let parent = node.parent;
    while (parent &&
        (typescript_1.default.isNonNullExpression(parent) || typescript_1.default.isParenthesizedExpression(parent) || typescript_1.default.isAsExpression(parent))) {
        node = parent;
        parent = node.parent;
    }
    return node;
}
