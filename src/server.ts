import express from 'express';
import cors from 'cors';
import SliceService from './lib/sliceService';
import InputTestService from './lib/inputTestService';
import multer from 'multer';
import uuid, { v4 } from 'uuid';


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

app.post('/upload/:params', upload.single('file'), (req, res) => {

    let newConfigParameters = JSON.parse(req.params.params);
    console.log(newConfigParameters)
    
    const uploadSliceService = new SliceService(req.file.filename, "a4", "none")
    uploadSliceService.runService()
        .then(resultedReadStream => {
            res.contentType("application/pdf");
            res.send(resultedReadStream)
        })
        .catch(err => { res.send({ ErrorMsg: err['ErrorMessage'] }) })

});

app.post('/test/:params', upload.single('file'), (req, res) => {

    let newConfigParameters = JSON.parse(req.params.params);
    console.log(newConfigParameters)
    
    const uploadSliceService = new InputTestService(req.file.filename)
    uploadSliceService.runService()
        .then((outputMessage) => res.send(outputMessage))
        .catch(err => { res.send({ ErrorMsg: err['ErrorMessage'] }) })

});


app.get('/', (req, res) => {
    res.send('...Hello...')
});

app.listen(port, () => console.log(`Express server running on ${port}.`));

