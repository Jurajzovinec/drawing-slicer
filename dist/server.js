"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var fs_1 = __importDefault(require("fs"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var callPythonSliceFileService_1 = __importDefault(require("./lib/callPythonSliceFileService"));
var callPythonValidateFileService_1 = __importDefault(require("./lib/callPythonValidateFileService"));
var sendReport_1 = __importDefault(require("./lib/sendReport"));
var uploadFileToAWS_1 = __importDefault(require("./lib/uploadFileToAWS"));
var downloadFileFromAWS_1 = __importDefault(require("./lib/downloadFileFromAWS"));
var simplifyObjectForLogger_1 = __importDefault(require("./lib/simplifyObjectForLogger"));
var clearPdfSlicerBucketOnAWS_1 = __importDefault(require("./lib/clearPdfSlicerBucketOnAWS"));
var listPdfSlicerBucketOnAWS_1 = __importDefault(require("./lib/listPdfSlicerBucketOnAWS"));
var app = express_1["default"]();
var port = parseInt(process.env.PORT, 10) || 5050;
app.use(express_fileupload_1["default"]());
app.use(express_1["default"].static('public'));
if (process.env.NODE_ENV === 'production') {
    app.use(cors_1["default"]());
}
else {
    app.use(cors_1["default"]({ origin: "http://localhost:3000" }));
}
app.post('/testfile', function (req, res) {
    console.log('/testfile API invoked');
    if (req.files.pdffile != undefined) {
        uploadFileToAWS_1["default"](req.files.pdffile)
            .then(function (resolvedMessage) {
            var testSliceService = new callPythonValidateFileService_1["default"](resolvedMessage.uploadedFile);
            return testSliceService.runService();
        })
            .then(function (response) { return res.send(response); })["catch"](function (rejectedMessage) {
            var reportToAdmin = new sendReport_1["default"]((typeof (rejectedMessage) === 'object') ? simplifyObjectForLogger_1["default"](rejectedMessage) : rejectedMessage, "ERROR");
            reportToAdmin.sendReport();
            res.send(rejectedMessage);
        });
    }
    else {
        res.send('Could not handle request. No recognized data attached.');
    }
});
app.get('/slice/:params', function (req, res) {
    console.log('/slicefile API invoked');
    var postedParams = JSON.parse(req.params.params);
    var sliceService = new callPythonSliceFileService_1["default"](postedParams.filename, (postedParams.scaleBeforeSlice === 'true') ? postedParams.scaleToFormat : "none", postedParams.sliceByFormat);
    sliceService.runService()
        .then(function (response) { return res.send(response); })["catch"](function (rejectedMessage) {
        var reportToAdmin = new sendReport_1["default"]((typeof (rejectedMessage) === 'object') ? simplifyObjectForLogger_1["default"](rejectedMessage) : rejectedMessage, "ERROR");
        reportToAdmin.sendReport();
        res.send(rejectedMessage);
    });
});
app.get('/exampledata', function (req, res) {
    console.log('/exampledata API invoked');
    try {
        var pdfExamplesZipFolder = "public/pdf_Examples.zip";
        var stat = fs_1["default"].statSync(pdfExamplesZipFolder);
        res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-Length': stat.size
        });
        var readStream = fs_1["default"].createReadStream(pdfExamplesZipFolder);
        readStream.pipe(res);
    }
    catch (e) {
        var reportToAdmin = new sendReport_1["default"]((typeof (e) === 'object') ? simplifyObjectForLogger_1["default"](e) : e, "ERROR");
        reportToAdmin.sendReport();
    }
});
app.get('/clearawsbucket', function (req, res) {
    console.log('/clearawsbucket API invoked');
    listPdfSlicerBucketOnAWS_1["default"]()
        .then(function (outputMessage) {
        if (outputMessage.status === 'OK') {
            return clearPdfSlicerBucketOnAWS_1["default"](outputMessage.filesOnBucket);
        }
        else {
            return outputMessage.error;
        }
    })
        .then(function (resolvedData) { return res.send(resolvedData); })["catch"](function (rejectedMessage) {
        var reportToAdmin = new sendReport_1["default"]((typeof (rejectedMessage) === 'object') ? simplifyObjectForLogger_1["default"](rejectedMessage) : rejectedMessage, "ERROR");
        reportToAdmin.sendReport();
    });
});
app.get('/listbucketobjects', function (req, res) {
    console.log('/listbucketobjects API invoked');
    listPdfSlicerBucketOnAWS_1["default"]()
        .then(function (resolvedData) { return res.send(resolvedData); })["catch"](function (rejectedMessage) {
        var reportToAdmin = new sendReport_1["default"]((typeof (rejectedMessage) === 'object') ? simplifyObjectForLogger_1["default"](rejectedMessage) : rejectedMessage, "ERROR");
        reportToAdmin.sendReport();
    });
});
app.post('/fileupload', function (req, res) {
    console.log('/fileupload API invoked');
    if (req.files.uploadedPdf != undefined) {
        uploadFileToAWS_1["default"](req.files.uploadedPdf)
            .then(function (resolvedMessage) { return res.send(resolvedMessage.status); })["catch"](function (rejectedMessage) {
            var reportToAdmin = new sendReport_1["default"]((typeof (rejectedMessage) === 'object') ? simplifyObjectForLogger_1["default"](rejectedMessage) : rejectedMessage, "ERROR");
            reportToAdmin.sendReport();
            res.send(rejectedMessage.status);
        });
    }
    else {
        res.send('Could not handle request. No recognized data attached.');
    }
});
app.get('/filedownload/:filetodownload', function (req, res) {
    console.log('/filedownload API invoked');
    var newConfigParameters = JSON.parse(req.params.filetodownload);
    console.log(newConfigParameters);
    if (JSON.parse(req.params.filetodownload)['requestedFileName']) {
        downloadFileFromAWS_1["default"](JSON.parse(req.params.filetodownload)['requestedFileName'])
            .then(function (data) {
            res.contentType("application/pdf; charset=utf-8");
            res.setHeader('Content-Length', data.ContentLength);
            res.end(data.Body);
        })["catch"](function (rejectedMessage) {
            var reportToAdmin = new sendReport_1["default"]((typeof (rejectedMessage) === 'object') ? simplifyObjectForLogger_1["default"](rejectedMessage) : rejectedMessage, "ERROR");
            reportToAdmin.sendReport();
            res.send(rejectedMessage);
        });
    }
    else {
        res.send('Could not handle request. Check for missing parameter {requestedFilename: fileToGet} in the URL.');
    }
});
app.use(function (err, req, res, next) {
    if (res.status != 200) {
        console.log(res.status);
        console.log(err);
        var reportToAdmin = new sendReport_1["default"]((typeof (err) === 'object') ? simplifyObjectForLogger_1["default"](err) : err, "ERROR");
        reportToAdmin.sendReport();
        res.send('Sorry something has broken :(.');
    }
});
if (process.env.NODE_ENV === 'production') {
    app.use(express_1["default"].static('client/build'));
}
app.listen(port, function () { return console.log("Express server running on " + port + "."); });
