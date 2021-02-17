import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import fileSystem from 'fs';

import upload from 'express-fileupload';

import CallSliceFileService from './lib/callPythonSliceFileService';
import CallValidateFileService from './lib/callPythonValidateFileService';
import SendReportMessageToAdmin from './lib/sendReport';
import uploadFileToAWS from './lib/uploadFileToAWS';
import downloadFileFromAWS from './lib/downloadFileFromAWS';

const app = express();
const port: number = parseInt(<string>process.env.PORT, 10) || 5050

app.use(upload());
app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}


app.post('/testfile', (req:any, res) => {
        
    if (req.files.pdffile != undefined) {
        uploadFileToAWS(req.files!.pdffile)
            .then(resolvedMessage => {
                const testSliceService = new CallValidateFileService(resolvedMessage.uploadedFile)
                return testSliceService.runService()
            })
            .then(response => res.send(response))
            .catch(rejectedMessage => res.send(rejectedMessage))
    } else {
        res.send('Could not handle request. No recognized data attached.')
    }
});


app.get('/slice/:params',  (req, res) => {
    
    const postedParams = JSON.parse(req.params.params);
    
    const sliceService = new CallSliceFileService(
        postedParams.Filename, 
        (postedParams.ScaleBeforeSlice === 'true') ? postedParams.ScaleToFormat : "none",
        postedParams.SliceBytFormat)
    sliceService.runService()
    .then(response => res.send(response))
    .catch(err => res.send(err))


    console.log(postedParams) 
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
    // console.log(upload.storage.getFilename);
    fs.readdir(uploads_folder, (err, files) => {
        res.send(files);
    });

});

app.get('/listrootdata', (req, res) => {

    fs.readdir(__dirname, (err, files) => {
        res.send(files);
    });

});

app.post('/fileupload', function(req, res) {

    console.log('file upload with AWS S3 invoked.');

    if (req.files.uploadedPdf != undefined) {
        uploadFileToAWS(req.files!.uploadedPdf)
            .then(resolvedMessage => res.send(resolvedMessage.status))
            .catch(rejectedMessage => res.send(rejectedMessage.status))
    } else {
        res.send('Could not handle request. No recognized data attached.')
    }
});

app.get('/filedownload/:filetodownload', (req, res) => {

    console.log('... File download  with S3 invoked. ...');

    let newConfigParameters = JSON.parse(req.params.filetodownload);
    console.log(newConfigParameters);

    if (JSON.parse(req.params.filetodownload)['requestedFileName']) {
        downloadFileFromAWS(JSON.parse(req.params.filetodownload)['requestedFileName'])
            .then(data => {
                // testPdfReaderCapabilty(data.Body);
                res.contentType("application/pdf; charset=utf-8");
                res.setHeader('Content-Length', data.ContentLength);
                res.end(data.Body)
            })
            .catch(rejectedMessage => res.send(rejectedMessage))
    } else {
        res.send('Could not handle request. Check for missing parameter {requestedFilename: fileToGet} in the URL.')
    }
});
 
app.use((err: any, req: any, res: any) => {

    if (res.status != 200) {
        res.send('Sorry something has broken :(.')
        let reportToAdmin = new SendReportMessageToAdmin(err, "ERROR")
        reportToAdmin.sendReport()
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(port, () => console.log(`Express server running on ${port}.`));

