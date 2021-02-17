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
    PYTHON_INPUT_TEST_SERVICE_PATH: (path_1["default"].resolve(process.cwd(), 'pythonServices\\service_validate_file.py')),
    AWS_ACCESS_KEY: 'AKIARIWICTPS5GWWZV4Q',
    AWS_SECRET_KEY: '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',
    AWS_ARN: 'arn:aws:iam::087392689125:user/pdf-slicer-user',
    AWS_BUCKET_NAME: 'pdf-slicer-bucket',
    NODE_MAILER_ACC: 'DrawingSlicerAppSender@outlook.com',
    NODE_MAILER_PASS: 'Hfca9Xyzx6vdCF5',
    NODE_MAILER_ADMIN_ACC: 'juraj.zovinecc@gmail.com'
};
exports["default"] = config;
