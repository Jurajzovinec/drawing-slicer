"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var config = {
    PYTHON_INTERPRETER_PATH: (process.env.NODE_ENV === 'production') ?
        '\\usr\\bin\\python' : (path_1["default"].resolve(process.cwd(), 'python_modules\\Scripts\\python')),
    PYTHON_SLICE_SERVICE_PATH: (path_1["default"].resolve(process.cwd(), 'pythonServices\\service_slice_file.py')),
    PYTHON_INPUT_TEST_SERVICE_PATH: (path_1["default"].resolve(process.cwd(), 'pythonServices\\service_validate_file.py'))
};
exports["default"] = config;
