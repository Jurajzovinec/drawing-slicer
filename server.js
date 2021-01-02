const express = require('express');
const services = require("./lib/services");
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');
const app = express();
const port = process.env.PORT || 5050;

if(process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}

//app.use(serveStatic(__dirname));

app.get('/slice', (req, res) => {
    services.sliceService();
/*     const { spawn } = require('child_process');
    const childPython = spawn(
        (path.join(__dirname, './pythonServices/environment/Scripts/python')),
        [(path.join(__dirname, './pythonServices/slice_service.py'))]
    );
    childPython.stdout.on('data', (data) => {
        console.log(`stdout: ${data}.`);
    });
    childPython.stderr.on('data', (data) => {
        console.log(`stderr: ${data}.`);
    });
    childPython.on('close', (code) => {
        console.log(`child process exited with code ${code}.`);
    });*/
}); 
 

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(port, () => console.log(`Express server running on ${port}.`));



