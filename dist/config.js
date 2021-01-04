"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config = {
    PYTHON_INTERPRETER: (path_1.default.resolve(process.cwd(), 'pythonServices\\environment\\Scripts\\python')),
    PYTHON_SLICE_SERVICE: (path_1.default.resolve(process.cwd(), 'pythonServices\\slice_service.py'))
};
exports.default = config;
