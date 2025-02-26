"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Updateblog = exports.Createblog = exports.Signininput = exports.Signupinput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.Signupinput = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
    name: zod_1.default.string().optional()
});
exports.Signininput = zod_1.default.object({
    username: zod_1.default.string().email(),
    password: zod_1.default.string().min(8)
});
exports.Createblog = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string()
});
exports.Updateblog = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    id: zod_1.default.number()
});
