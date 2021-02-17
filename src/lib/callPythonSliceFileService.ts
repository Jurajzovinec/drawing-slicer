import config from '../config';
import { spawn } from 'child_process';

export default class CallSliceFileService {
    constructor(
        public fileToSlice: string,
        public scalingFormat: "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8" | "none",
        public slicingFormat: "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6" | "a7" | "a8",
    ) { }

    runService() {
        return new Promise(async (resolve, reject) => {
            this.handlePythonMicroService()
                .then(resolve)
                .catch(err => reject(err))
        });
    }

    handlePythonMicroService(): Promise<(object)> {
        console.log(this.scalingFormat)
        console.log("...handlingPythonMicroService...");
        return new Promise(async (resolve, reject) => {
            const pythonSliceMicroService = spawn(
                config.PYTHON_INTERPRETER_PATH, 
                [
                    config.PYTHON_SLICE_SERVICE_PATH, 
                    this.fileToSlice, 
                    this.scalingFormat, 
                    this.slicingFormat
                ]);
            let outputMessage: object = {}
            let upcomingData: string;

            pythonSliceMicroService.stdout.on('data', (data: string) => {
                if (data.toString().includes("Ooops!")) {
                    console.log(data.toString());
                    reject({
                        "ErrorMessage": data.toString().trim(),
                        "Status": "Fail"
                    })
                } else {
                    upcomingData = (data.toString()).replace(/'/g, '\"').trim();
                    upcomingData = upcomingData.replace(/(\r\n|\n|\r)/gm, "");
                    upcomingData = upcomingData.replace(/}{/g, "}SplittingDelimiter{");
                    upcomingData.split(/SplittingDelimiter/g).forEach(element => {
                        outputMessage = Object.assign({}, outputMessage, JSON.parse(element));
                    });
                }
            });

            pythonSliceMicroService.on('close', (code: string) => {
                if (code == "0") {
                    outputMessage = (Object.assign({}, outputMessage, { Status: "Success"}))
                    resolve(outputMessage);
                }
            });
        });
    }
}