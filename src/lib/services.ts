import config from '../config';
import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

function services(){
    console.log(config.PYTHON_INTERPRETER, config.PYTHON_SLICE_SERVICE)
}

function sendResultedSlicedPDF() {
    console.log("...sendingResultedPDF...");
    return new Promise(async (resolve, reject) => {
        const readableStreamDataPf = fs.createReadStream('./public/result.pdf');
        resolve(readableStreamDataPf);
    });
}

function handlePythonMicroService() {
    console.log("...handlingPythonMicroService...");
    return new Promise(async (resolve, reject) => {
        
        const pythonSliceMicroService = spawn(config.PYTHON_INTERPRETER, [config.PYTHON_SLICE_SERVICE]);
        console.log(config.PYTHON_INTERPRETER, config.PYTHON_SLICE_SERVICE)
        pythonSliceMicroService.stdout.on('data', (data:string) => {
            console.log(`stdout: ${data}.`);
        });
        pythonSliceMicroService.stderr.on('data', (data:string) => {
            reject(`stderr: ${data}.`);
        });
        pythonSliceMicroService.on('close', (code:string) => {
            resolve(`child process exited with code ${code}.`);
        });
    });
}

function sliceService() {
    return new Promise(async (resolve, reject) => {
        handlePythonMicroService()
            .then(sendResultedSlicedPDF)
            .then(resultPdfData => {
                console.log(typeof(resultPdfData));
                resolve(resultPdfData);  
            }) 
            .catch((error) => reject(error));
    });
}

export default { services , sliceService } 