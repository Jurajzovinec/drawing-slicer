import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import fileSystem from 'fs';
import SliceService from './lib/sliceService';
import InputTestService from './lib/inputTestService';
import SendReportMessageToAdmin from './lib/sendReport';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, (path.join(__dirname, 'uploads')));
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${v4()}-${originalname}`);
    }
});

const upload = multer({ storage: storage })

const app = express();

const port: number = parseInt(<string>process.env.PORT, 10) || 5050

if (process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}

app.use(express.static('public'));

app.post('/testfile', upload.single('file'), (req, res) => {
        
    const pathToFile = (path.join('uploads' + req.file.filename))
    const testSliceService = new InputTestService(pathToFile)
    testSliceService.runService()
        .then(response => res.send(response))
        .catch(err => {
            res.send(err)
        })
});

app.get('/resultdata', (req, res) => {

    res.contentType("application/pdf");
    res.send(fs.readFileSync(req.headers.requestedfile!.toString()));

});

app.get('/exampledata', (req, res) => {

    const pdfExamplesZipFolder = "public/pdf_Examples.zip";

    const stat = fileSystem.statSync(pdfExamplesZipFolder);

    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size
    });

    const readStream = fileSystem.createReadStream(pdfExamplesZipFolder);
    readStream.pipe(res);

});

app.get('/clearpdfdata', (req, res) => {

    const directory = 'uploads';
    try {
        fs.readdir('uploads', (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    } catch (err) {
        console.log('Error has occured: ' + err)
    }
    res.send('Cleared.')
});

app.get('/listpdfdata', (req, res) => {

    const uploads_folder = 'uploads';

    fs.readdir(uploads_folder, (err, files) => {
        res.send(files);
    });

});

app.get('/listrootdata', (req, res) => {

    fs.readdir(__dirname, (err, files) => {
        res.send(files);
    });

});

app.post('/slice/:params', upload.single('file'), (req, res) => {

    let postedParams = JSON.parse(req.params.params);
    console.log(postedParams)

    const testSliceService = new SliceService
        (
            req.file.filename,
            (postedParams.ScaleBeforeSlice === 'true') ? postedParams.ScaleToFormat : "none",
            postedParams.SliceByFormat
        )
    console.log('Here it still works...')
    testSliceService.runService()
        .then(response => res.send(response))
        .catch(err => res.send(err))
});

app.use(function (err, req, res, next) {

    if (res.status != 200) {
        res.send('Sory something has broken :(.')
        let reportToAdmin = new SendReportMessageToAdmin(err, "ERROR")
        reportToAdmin.sendReport()
    }

})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(port, () => console.log(`Express server running on ${port}.`));

