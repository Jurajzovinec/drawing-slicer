import config from '../config';
import { spawn } from 'child_process';
import { spawnValidateRequest,spawnValidateResponse } from './types/spawnPythonServicesObjects';

export default function spawnValidateFileService(args: spawnValidateRequest): Promise<spawnValidateResponse> {

    const PYTHON_INTERPRETER_PATH = config.PYTHON_INTERPRETER_PATH;
    const PYTHON_VALIDATE_SERVICE_PATH = config.PYTHON_INPUT_TEST_SERVICE_PATH;

    let pythonAnswerMessage: spawnValidateResponse;

    return new Promise(async (resolve, reject) => {
        const pythonSliceMicroService = spawn(
            PYTHON_INTERPRETER_PATH, [
            PYTHON_VALIDATE_SERVICE_PATH,
            args.uploadedFile
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