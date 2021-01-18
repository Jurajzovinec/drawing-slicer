import config from '../config';
import fs from 'fs';
import { spawn } from 'child_process';

function services() {
    console.log(config.PYTHON_INTERPRETER, config.PYTHON_SLICE_SERVICE)
}

type validInputs = "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8" ;

enum ValidInput { a0, a1, a2, a3, a4, a5, a6, a7, a8 }

type ServiceOptions = {
    fileToSlice: string;
    slicingFormat: validInputs;
    scalingFormat: validInputs | "none"; 
}

function sendResultedSlicedPDF() {
    console.log("...sendingResultedPDF...");
    return new Promise(async (resolve, reject) => {
        //const readableStreamDataPdf = fs.createReadStream('./public/result.pdf');
        const pdfData = fs.readFileSync('./sliced_pdf_results/sliced_result.pdf');
        resolve(pdfData);
    });
}

function handlePythonMicroService(inputs:ServiceOptions): Promise<{ promiseResultData: string }> {
    console.log("...handlingPythonMicroService...");

    const inputDrawingFile = `./uploads/${inputs.fileToSlice}`;
    const sliceToFormat = inputs.slicingFormat;
    const scaleToFormat = inputs.scalingFormat;
    
    return new Promise(async (resolve, reject) => {
        const pythonSliceMicroService = spawn(config.PYTHON_INTERPRETER, [config.PYTHON_SLICE_SERVICE, inputDrawingFile, sliceToFormat, scaleToFormat]);       

        pythonSliceMicroService.stdout.on('data', (data: string) => {
            console.log(data);
        });

        pythonSliceMicroService.stderr.on('data', (data: string) => {
            console.log(data)
            reject({ promiseResultData: data });
        });

        pythonSliceMicroService.stdout.on('end', (data: any) => {
            console.log(data);
        });
        
        pythonSliceMicroService.on('close', (code: string) => {
            console.log(code)
            resolve({ promiseResultData: `child process exited with code ${code}.` });
        }); 
    });
}

function sliceService(inputs:ServiceOptions) {
    return new Promise(async (resolve, reject) => {
        handlePythonMicroService(inputs)
            .then(sendResultedSlicedPDF)
            .then(resultPdfData => {
                resolve(resultPdfData);
            })
            .catch((error) => reject(error));
    });
}

export default { services, sliceService } 