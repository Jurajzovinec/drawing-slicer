import config from '../config';
import fs from 'fs';
import { spawn } from 'child_process';

function services() {
    console.log(config.PYTHON_INTERPRETER, config.PYTHON_SLICE_SERVICE)
}

function sendResultedSlicedPDF() {
    console.log("...sendingResultedPDF...");
    return new Promise(async (resolve, reject) => {
        //const readableStreamDataPdf = fs.createReadStream('./public/result.pdf');
        const pdfData = fs.readFileSync('./sliced_pdf_results/sliced_result.pdf');
        resolve(pdfData);
    });
}

function handlePythonMicroService(): Promise<{ promiseResultData: string }> {
    console.log("...handlingPythonMicroService...");

    const input_drawing_file = './public/VykresA4_1.pdf';
    const slice_to_format = "a5";
    
    return new Promise(async (resolve, reject) => {

        const pythonSliceMicroService = spawn(config.PYTHON_INTERPRETER, [config.PYTHON_SLICE_SERVICE, input_drawing_file, slice_to_format, "a0"]);
        
        pythonSliceMicroService.stdout.on('data', (data: string) => {
            console.log(data);
        });

        pythonSliceMicroService.stderr.on('data', (data: string) => {
            reject({ promiseResultData: data });
        });
        pythonSliceMicroService.on('close', (code: string) => {
            resolve({ promiseResultData: `child process exited with code ${code}.` });
        });
    });
}

function sliceService() {
    return new Promise(async (resolve, reject) => {
        handlePythonMicroService()
            .then(sendResultedSlicedPDF)
            .then(resultPdfData => {
                resolve(resultPdfData);
            })
            .catch((error) => reject(error));
    });
}

export default { services, sliceService } 