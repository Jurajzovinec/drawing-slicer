import config from '../config';
import { spawn } from 'child_process';
import path from 'path';

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

        console.log("...handlingTestPythonMicroService...");
        return new Promise(async (resolve, reject) => {
            const pythonSliceMicroService = spawn(config.PYTHON_INTERPRETER_PATH, [config.PYTHON_INPUT_TEST_SERVICE_PATH, this.fileToSlice]);
            let outputMessage: object = {}
            let upcomingData: string;

            pythonSliceMicroService.stdout.on('data', (data: string) => {                
                if (data.toString().includes("Ooops!")) {
                    reject({
                        "ErrorMessage": data.toString().trim(),
                        "Status": "Fail"
                    })
                } else {
                    upcomingData = (data.toString()).replace(/'/g, '\"').trim();
                    upcomingData = upcomingData.replace(/(\r\n|\n|\r)/gm, "");
                    upcomingData = upcomingData.replace("}{", "}SplittingDelimiter{");
                    upcomingData.split(/SplittingDelimiter/g).forEach(element => {
                        outputMessage = Object.assign({}, outputMessage, JSON.parse(element));
                    });
                }
            });

            pythonSliceMicroService.on('close', (code: string) => {
                if (code == "0") {
                    resolve(Object.assign({}, outputMessage,{Status: "Success"}));
                }
            });
        });
    }

}