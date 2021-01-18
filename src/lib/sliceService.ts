import config from '../config';
import fs from 'fs';
import { spawn } from 'child_process';

export default class SliceService {
    constructor(
        public fileToSlice: string,
        public slicingFormat: "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8",
        public scalingFormat: "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8" | "none",
    ) { }

    runService() {
        return new Promise(async (resolve, reject) => {
            this.handlePythonMicroService()
                .then(pyServiceResultData => this.sendResultedSlicedPDF(pyServiceResultData))
                .then(resolve)
                .catch(err => reject(err))
        });
    }

    handlePythonMicroService(): Promise<(string)> {
        console.log("...handlingPythonMicroService...");
        return new Promise(async (resolve, reject) => {
            const pythonSliceMicroService = spawn(config.PYTHON_INTERPRETER, [config.PYTHON_SLICE_SERVICE, `./uploads/${this.fileToSlice}`, this.slicingFormat, this.scalingFormat]);
            
            pythonSliceMicroService.stdout.on('data', (data: string) => {
                reject(data.toString());
            });
               
            pythonSliceMicroService.on('close', (code: string) => {
                if (code == "0") {
                    resolve('./sliced_pdf_results/sliced_result.pdf');
                }
            });
        });
    }

    sendResultedSlicedPDF(pyServiceResultData: string): Promise<(Buffer)> {
        console.log("...sendingResultedPDF...");
        return new Promise(async (resolve, reject) => {
            const pdfData = fs.readFileSync('./sliced_pdf_results/sliced_result.pdf');
            resolve(pdfData);
        });
    }
}