"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
function services() {
    console.log(config_1.default.PYTHON_INTERPRETER, config_1.default.PYTHON_SLICE_SERVICE);
}
function sendResultedSlicedPDF() {
    console.log("...sendingResultedPDF...");
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        //const readableStreamDataPdf = fs.createReadStream('./public/result.pdf');
        const pdfData = fs_1.default.readFileSync('./public/result.pdf');
        resolve(pdfData);
    }));
}
function handlePythonMicroService() {
    console.log("...handlingPythonMicroService...");
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const pythonSliceMicroService = child_process_1.spawn(config_1.default.PYTHON_INTERPRETER, [config_1.default.PYTHON_SLICE_SERVICE]);
        pythonSliceMicroService.stderr.on('data', (data) => {
            reject({ promiseResultData: data });
        });
        pythonSliceMicroService.on('close', (code) => {
            resolve({ promiseResultData: `child process exited with code ${code}.` });
        });
    }));
}
function sliceService() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        handlePythonMicroService()
            .then(sendResultedSlicedPDF)
            .then(resultPdfData => {
            resolve(resultPdfData);
        })
            .catch((error) => reject(error));
    }));
}
exports.default = { services, sliceService };
