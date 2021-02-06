import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import SliceService from './lib/sliceService';
import InputTestService from './lib/inputTestService';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
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

app.post('/test/:params', upload.single('file'), (req, res) => {

    const testSliceService = new InputTestService(req.file.filename)
    console.log('Here it still works...')
    testSliceService.runService()
        .then(response => res.send(response))
        .catch(err => res.send(err))

});

app.get('/resultdata', (req, res) => {

    res.contentType("application/pdf");
    res.send(fs.readFileSync(req.headers.requestedfile!.toString()));

});


app.get('/clearpdfdata', (req, res) => {

    const directory = 'uploads';

    fs.readdir('uploads', (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
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

app.listen(port, () => console.log(`Express server running on ${port}.`));

