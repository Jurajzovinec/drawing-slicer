const settings = require('../settings');

function sliceService() {
    
    const { spawn } = require('child_process');
    
    const childPython = spawn(settings.PYTHON_INTERPRETER, [settings.PYTHON_SLICE_SERVICE]);
 
    childPython.stdout.on('data', (data) => {
        console.log(`stdout: ${data}.`);
    });

    childPython.stderr.on('data', (data) => {
        console.log(`stderr: ${data}.`);
    });

    childPython.on('close', (code) => {
        console.log(`child process exited with code ${code}.`);
    });
}

module.exports = { sliceService };

