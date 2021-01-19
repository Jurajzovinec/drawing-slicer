import config from '../config';
import fs from 'fs';
import { spawn } from 'child_process';

export default class InputTestService {
    constructor(
        public fileToSlice: string,
    ) { }

    runService() {
        return new Promise(async (resolve, reject) => {
            this.handlePythonMicroService()
                .then(resolve)
                .catch(err => reject(err))
        });
    }

    handlePythonMicroService(): Promise<(object)> {
        console.log("...handlingPythonMicroService...");
        return new Promise(async (resolve, reject) => {
            const pythonSliceMicroService = spawn(config.PYTHON_INTERPRETER_PATH, [config.PYTHON_INPUT_TEST_SERVICE_PATH, `./uploads/${this.fileToSlice}`]);
            
            let outputMessage: string = ""

            pythonSliceMicroService.stdout.on('data', (data: string) => {
                if (data.toString().includes("Success")) {
                    outputMessage = data.toString().trim()
                } else {
                    reject({"ErrorMessage": data.toString().trim()})
                }
            });

            pythonSliceMicroService.on('close', (code: string) => {
                if (code == "0") {
                    resolve({
                        "inputDrawingFormat": outputMessage
                    })
                }
            });
        });
    }

}