import express from 'express';
import cors from 'cors';
import services from './lib/services';
import  fileUpload  from 'express-fileupload';
//import fileUpload  = require("../node_modules/@types/express-fileupload");

const app = express();

const port: number = parseInt(<string>process.env.PORT, 10) || 5050

if (process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}

app.get('/', (req, res) => {
    res.send('...Hello...')
});

app.post('/upload', fileUpload(), function(req, res) {  
    // https://stackoverflow.com/questions/52140939/how-to-send-pdf-file-from-front-end-to-nodejs-server
    res.send('File uploaded');
  })

app.get('/sliceservice', (req, res) => {
    services.sliceService()
        .then(resultedReadStream => {
            res.contentType("application/pdf");
            res.send(resultedReadStream);
        });
});

app.listen(port, () => console.log(`Express server running on ${port}.`));

