import express from 'express';
import cors from 'cors';
import fileSystem from 'fs';
import upload from 'express-fileupload';
import CallSliceFileService from './lib/callPythonSliceFileService';
import CallValidateFileService from './lib/callPythonValidateFileService';
import SendReportMessageToAdmin from './lib/sendReport';
import uploadFileToAWS from './lib/uploadFileToAWS';
import downloadFileFromAWS from './lib/downloadFileFromAWS';
import simplifyObject from './lib/simplifyObjectForLogger';
import clearPdfSlicerBucket from './lib/clearPdfSlicerBucketOnAWS';
import listPdfSlicerBucketOnAWS from './lib/listPdfSlicerBucketOnAWS';

const app = express();
const port: number = parseInt(<string>process.env.PORT, 10) || 5050

app.use(upload());
app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}


app.post('/testfile', (req: any, res) => {

    console.log('/testfile API invoked')

    if (req.files.pdffile != undefined) {
        uploadFileToAWS(req.files!.pdffile)
            .then(resolvedMessage => {
                const testSliceService = new CallValidateFileService(resolvedMessage.uploadedFile)
                return testSliceService.runService()
            })
            .then(response => res.send(response))
            .catch(rejectedMessage => {
                let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? simplifyObject(rejectedMessage) : rejectedMessage, "ERROR")
                reportToAdmin.sendReport()
                res.send(rejectedMessage)
            })
    } else {
        res.send('Could not handle request. No recognized data attached.')
    }
});

app.get('/slice/:params', (req, res) => {

    console.log('/slicefile API invoked')

    const postedParams = JSON.parse(req.params.params);

    const sliceService = new CallSliceFileService(
        postedParams.Filename,
        (postedParams.ScaleBeforeSlice === 'true') ? postedParams.ScaleToFormat : "none",
        postedParams.SliceByFormat
    )
    sliceService.runService()
        .then(response => res.send(response))
        .catch(rejectedMessage => {
            let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? simplifyObject(rejectedMessage) : rejectedMessage, "ERROR")
            reportToAdmin.sendReport()
            res.send(rejectedMessage)
        })

});

app.get('/exampledata', (req, res) => {

    console.log('/exampledata API invoked')
    try {
        const pdfExamplesZipFolder = "public/pdf_Examples.zip";
        const stat = fileSystem.statSync(pdfExamplesZipFolder);
        res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-Length': stat.size
        });
        const readStream = fileSystem.createReadStream(pdfExamplesZipFolder);
        readStream.pipe(res);
    } catch (e) {
        let reportToAdmin = new SendReportMessageToAdmin((typeof (e) === 'object') ? simplifyObject(e) : e, "ERROR")
        reportToAdmin.sendReport()
    }


});

app.get('/clearawsbucket', (req, res) => {

    console.log('/clearawsbucket API invoked')

    listPdfSlicerBucketOnAWS()
        .then(outputMessage => {
            if (outputMessage.status === 'OK') {
                return clearPdfSlicerBucket(outputMessage.filesOnBucket)
            } else {
                return outputMessage.error
            }
        })
        .then(resolvedData => res.send(resolvedData))
        .catch(rejectedMessage => {
            let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? simplifyObject(rejectedMessage) : rejectedMessage, "ERROR")
            reportToAdmin.sendReport()
        });

});

app.get('/listbucketobjects', (req, res) => {

    console.log('/listbucketobjects API invoked')

    listPdfSlicerBucketOnAWS()
        .then(resolvedData => res.send(resolvedData))
        .catch(rejectedMessage => {
            let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? simplifyObject(rejectedMessage) : rejectedMessage, "ERROR")
            reportToAdmin.sendReport()
        });

});

app.post('/fileupload', function (req, res) {

    console.log('/fileupload API invoked')

    if (req.files.uploadedPdf != undefined) {
        uploadFileToAWS(req.files!.uploadedPdf)
            .then(resolvedMessage => res.send(resolvedMessage.status))
            .catch(rejectedMessage => {
                let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? simplifyObject(rejectedMessage) : rejectedMessage, "ERROR")
                reportToAdmin.sendReport()
                res.send(rejectedMessage.status)
            })
    } else {
        res.send('Could not handle request. No recognized data attached.')
    }
});

app.get('/filedownload/:filetodownload', (req, res) => {

    console.log('/filedownload API invoked')

    let newConfigParameters = JSON.parse(req.params.filetodownload);
    console.log(newConfigParameters);

    if (JSON.parse(req.params.filetodownload)['requestedFileName']) {
        downloadFileFromAWS(JSON.parse(req.params.filetodownload)['requestedFileName'])
            .then(data => {
                res.contentType("application/pdf; charset=utf-8");
                res.setHeader('Content-Length', data.ContentLength);
                res.end(data.Body)
            })
            .catch(rejectedMessage => {
                let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? simplifyObject(rejectedMessage) : rejectedMessage, "ERROR")
                reportToAdmin.sendReport()
                res.send(rejectedMessage);
            })
    } else {
        res.send('Could not handle request. Check for missing parameter {requestedFilename: fileToGet} in the URL.')
    }
});

app.use(function (err: any, req: any, res: any, next: any) {

    if (res.status != 200) {
        console.log(res.status)
        console.log(err)
        let reportToAdmin = new SendReportMessageToAdmin((typeof (err) === 'object') ? simplifyObject(err) : err, "ERROR")
        reportToAdmin.sendReport()
        res.send('Sorry something has broken :(.')
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(port, () => console.log(`Express server running on ${port}.`));

