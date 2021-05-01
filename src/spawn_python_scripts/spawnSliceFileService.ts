import config from '../config';
import { spawn } from 'child_process';
import { spawnSliceRequest, spawnSliceResponse } from './types/spawnPythonServicesObjects';

export default function spawnValidateFileService(args: spawnSliceRequest): Promise<spawnSliceResponse> {

    const PYTHON_INTERPRETER_PATH = 'C:\\Users\\juraj\\Desktop\\Coding\\DrawingSlicer\\drawing-slicer\\python_modules\\Scripts\\python.exe'
    const PYTHON_SLICE_SERVICE_PATH = 'C:\\Users\\juraj\\Desktop\\Coding\\DrawingSlicer\\drawing-slicer\\python_services\\service_slice_file.py'
    //const PYTHON_SLICE_SERVICE_PATH = 'C:\\Users\\juraj\\Desktop\\Coding\\DrawingSlicer\\drawing-slicer\\python_services\\application_library\\small_test_python.py'

    let pythonAnswerMessage: spawnSliceResponse;

    return new Promise(async (resolve, reject) => {
        const pythonSliceMicroService = spawn(
            PYTHON_INTERPRETER_PATH, [
            PYTHON_SLICE_SERVICE_PATH,
            args.filename,
            args.slicingFormat,
            args.scalingFormat
        ]
        );

        pythonSliceMicroService.stdout.setEncoding('utf8');
        pythonSliceMicroService.stdout.on('data', function (data) {
            try {
                JSON.parse(data);
                pythonAnswerMessage = JSON.parse(data);
            } catch (e) {
                console.log(data);
            }
        });

        pythonSliceMicroService.on('close', (code: string) => {
            console.log(code);
            console.log(pythonAnswerMessage);
            if (code == "0") {
                resolve(
                    pythonAnswerMessage
                );
            } else {
                reject(
                    pythonAnswerMessage
                );
            }
        });

    });

};