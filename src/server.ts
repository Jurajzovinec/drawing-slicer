import express from 'express';
import cors from 'cors';
import fileSystem from 'fs';
import upload from 'express-fileupload';

import sendReport from './nodemailer_functions/sendReport';

import uploadFileToAWS from './aws_s3_services/uploadFileToAWS';
import downloadFileFromAWS from './aws_s3_services/downloadFileFromAWS';
import clearPdfSlicerBucketAWS from './aws_s3_services/clearPdfSlicerBucketOnAWS';
import listPdfSlicerBucketOnAWS from './aws_s3_services/listPdfSlicerBucketOnAWS';

import spawnValidateFileService from './spawn_python_scripts/spawnValidateFileService';
import spawnSliceFileService from './spawn_python_scripts/spawnSliceFileService';


const app = express();
const port: number = parseInt(<string>process.env.PORT, 10) || 5050

app.use(upload());
app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
    app.use(cors({ origin: "*" }));
}

/*
200 - > Ok done
202 - > Ok, but some user error occured
400 - > Bad request, check form data
404 - > Missing req data/information
500 - > God knows what happened, log information sent to Developer/Admin
*/

// PRODUCTION PRIMARY API

app.post('/validatefile', (req: any, res) => {

    console.log('/validatefile API invoked');

    if (req.files == undefined) {
        res.status(404);
        res.send({
            status: 'FAILED',
            error: 'Could not handle request. No recognized data attached.'
        })
    }

    else if (req.files.pdffile == undefined) {
        res.status(400);
        res.send({
            status: 'FAILED',
            error: "Could not handle request. Make sure formdata file key name is 'pdffile'."
        })

    } else {

        uploadFileToAWS(req.files!.pdffile)
            .then(resolvedObj => {
                spawnValidateFileService({ uploadedFile: req.files!.pdffile.name })
                    .then(resolvedObj => {
                        res.status(200);
                        res.send(resolvedObj)
                    })
                    .catch(rejectedObj => {
                        res.status(202);
                        res.send(rejectedObj)
                    });
            })
            .catch(rejectedObj => res.send(rejectedObj));
    }

});

app.get('/slice/:params', (req, res) => {

    console.log('/slicefile API invoked')

    const postedParams = JSON.parse(req.params.params);

    spawnSliceFileService({
        filename: postedParams.filename,
        slicingFormat: postedParams.slicingFormat,
        scalingFormat: postedParams.scalingFormat
    })
        .then(resolvedObj => {
            res.status(200);
            res.send(resolvedObj)
        })
        .catch(rejectedObj => {
            res.status(202);
            res.send(rejectedObj)
        });
});

app.get('/clearawsbucket', (req, res) => {

    console.log('/clearawsbucket API invoked')

    listPdfSlicerBucketOnAWS()
        .then(outputMessage => clearPdfSlicerBucketAWS(outputMessage.filesOnBucket!))
        .then(resolvedData => {
            res.status(200);
            res.send(resolvedData)
        })
        .catch(rejectedMessage => {
            res.status(202);
            res.send(rejectedMessage)
        })
});

app.get('/listbucketobjects', (req, res) => {

    console.log('/listbucketobjects API invoked')

    listPdfSlicerBucketOnAWS()
        .then(resolvedData => {
            res.status(200);
            res.send(resolvedData)
        })
        .catch(rejectedMessage => {
            res.status(202);
            res.send(rejectedMessage)
        });

});

app.get('/exampledata', (req, res) => {

    console.log('/exampledata API invoked')

    const pdfExamplesZipFolder = "public/pdf_Examples.zip";
    const stat = fileSystem.statSync(pdfExamplesZipFolder);

    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size
    });

    const readStream = fileSystem.createReadStream(pdfExamplesZipFolder);
    readStream.pipe(res);

});

app.get('/filedownload/:filetodownload', (req, res) => {

    console.log('/filedownload API invoked')

    if (JSON.parse(req.params.filetodownload)['requestedFileName']) {
        downloadFileFromAWS(JSON.parse(req.params.filetodownload)['requestedFileName'])
            .then(resolvedResponse => {
                res.status(200);
                res.contentType("application/pdf; charset=utf-8");
                res.setHeader('Content-Length', resolvedResponse.data.ContentLength);
                res.end(resolvedResponse.data.Body)
            })
            .catch(rejectedMessage => {
                res.status(202);
                res.send(rejectedMessage);
            })
    } else {
        res.send('Could not handle request. Check for missing parameter {requestedFilename: fileToGet} in the URL.')
    }
});

// DEVELOPMENT SECONDARY API

app.post('/uploadsinglefile', (req: any, res) => {

    console.log('/uploadSingleFile API invoked')

    if (req.files == undefined) {
        res.send({
            status: 'FAILED',
            statusCode: 404,
            error: 'Could not handle request. No recognized data attached.'
        })
    }

    else if (req.files.pdffile == undefined) {
        res.send({
            status: 'FAILED',
            statusCode: 400,
            error: "Could not handle request. Make sure formdata file key name is 'pdffile'."
        })
    }

    else {
        uploadFileToAWS(req.files!.pdffile)
            .then(resolvedObj => res.send(resolvedObj))
            .catch(rejectedObj => {
                res.send(rejectedObj)
            });
    }

});






/*
app.get('/slice/:params', (req, res) => {

    console.log('/slicefile API invoked')

    const postedParams = JSON.parse(req.params.params);

    const sliceService = new CallSliceFileService(
        postedParams.filename,
        (postedParams.scaleBeforeSlice === 'true') ? postedParams.scaleToFormat : "none",
        postedParams.sliceByFormat
    )
    sliceService.runService()
        .then(response => res.send(response))
        .catch(rejectedMessage => {
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
    } catch (rejectedMessage) {
        let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? JSON.stringify(rejectedMessage) : rejectedMessage, "ERROR")
        reportToAdmin.sendReport()
    }
});



app.get('/listbucketobjects', (req, res) => {

    console.log('/listbucketobjects API invoked')

    listPdfSlicerBucketOnAWS()
        .then(resolvedData => res.send(resolvedData))
        .catch(rejectedMessage => {
            let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? JSON.stringify(rejectedMessage) : rejectedMessage, "ERROR")
            reportToAdmin.sendReport()
        });

});

app.post('/fileupload', function (req, res) {

    console.log('/fileupload API invoked')

    if (req.files!.uploadedPdf != undefined) {
        uploadFileToAWS(req.files!.uploadedPdf)
            .then(resolvedMessage => res.send(resolvedMessage.status))
            .catch(rejectedMessage => {
                let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? JSON.stringify(rejectedMessage) : rejectedMessage, "ERROR")
                reportToAdmin.sendReport()
                res.send(rejectedMessage.status)
            })
    } else {
        res.send('Could not handle request. No recognized data attached.')
    }
});

app.get('/filedownload/:filetodownload', (req, res) => {

    console.log('/filedownload API invoked')

    if (JSON.parse(req.params.filetodownload)['requestedFileName']) {
        downloadFileFromAWS(JSON.parse(req.params.filetodownload)['requestedFileName'])
            .then(data => {
                res.contentType("application/pdf; charset=utf-8");
                res.setHeader('Content-Length', data.ContentLength);
                res.end(data.Body)
            })
            .catch(rejectedMessage => {
                let reportToAdmin = new SendReportMessageToAdmin((typeof (rejectedMessage) === 'object') ? JSON.stringify(rejectedMessage) : rejectedMessage, "ERROR")
                reportToAdmin.sendReport()
                res.send(rejectedMessage);
            })
    } else {
        res.send('Could not handle request. Check for missing parameter {requestedFilename: fileToGet} in the URL.')
    }
});

*/

app.use(function (err: any, req: any, res: any, next: any) {

    if (res.status != 200) {

        let error = (typeof (err) === 'object') ? JSON.stringify(err) : err;

        sendReport({ level: 'ERROR', reportMessage: error })
        res.status(500);
        res.send({
            status: 'FAILED',
            error: 'Server side error. Sorry something has broken :(.'
        });
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(port, () => console.log(`Express server running on ${port}.`));

