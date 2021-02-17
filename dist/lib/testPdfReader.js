"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var config_1 = __importDefault(require("../config"));
var child_process_1 = require("child_process");
function testPdfReaderCapabilty(filename) {
    var pythonSliceMicroService = child_process_1.spawn(config_1["default"].PYTHON_INTERPRETER_PATH, [config_1["default"].PYTHON_WILL_PDF_INIT_PATH, filename]);
    pythonSliceMicroService.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    pythonSliceMicroService.stderr.on('err', function (err) {
        console.log(err);
    });
}
exports["default"] = testPdfReaderCapabilty;
