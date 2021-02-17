"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var fs_2 = __importDefault(require("fs"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var callPythonSliceFileService_1 = __importDefault(require("./lib/callPythonSliceFileService"));
var callPythonValidateFileService_1 = __importDefault(require("./lib/callPythonValidateFileService"));
var sendReport_1 = __importDefault(require("./lib/sendReport"));
var uploadFileToAWS_1 = __importDefault(require("./lib/uploadFileToAWS"));
var downloadFileFromAWS_1 = __importDefault(require("./lib/downloadFileFromAWS"));
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
    if (req.files.pdffile != undefined) {
        uploadFileToAWS_1["default"](req.files.pdffile)
            .then(function (resolvedMessage) {
            var testSliceService = new callPythonValidateFileService_1["default"](resolvedMessage.uploadedFile);
            return testSliceService.runService();
        })
            .then(function (response) { return res.send(response); })["catch"](function (rejectedMessage) { return res.send(rejectedMessage); });
    }
    else {
        res.send('Could not handle request. No recognized data attached.');
    }
});
app.get('/slice/:params', function (req, res) {
    var postedParams = JSON.parse(req.params.params);
    var sliceService = new callPythonSliceFileService_1["default"](postedParams.Filename, (postedParams.ScaleBeforeSlice === 'true') ? postedParams.ScaleToFormat : "none", postedParams.SliceBytFormat);
    sliceService.runService()
        .then(function (response) { return res.send(response); })["catch"](function (err) { return res.send(err); });
    console.log(postedParams);
});
app.get('/resultdata', function (req, res) {
    res.contentType("application/pdf");
    res.send(fs_1["default"].readFileSync(req.headers.requestedfile.toString()));
});
app.get('/exampledata', function (req, res) {
    var pdfExamplesZipFolder = "public/pdf_Examples.zip";
    var stat = fs_2["default"].statSync(pdfExamplesZipFolder);
    res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Length': stat.size
    });
    var readStream = fs_2["default"].createReadStream(pdfExamplesZipFolder);
    readStream.pipe(res);
});
app.get('/clearpdfdata', function (req, res) {
    var directory = 'uploads';
    try {
        fs_1["default"].readdir('uploads', function (err, files) {
            if (err)
                throw err;
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                fs_1["default"].unlink(path_1["default"].join(directory, file), function (err) {
                    if (err)
                        throw err;
                });
            }
        });
    }
    catch (err) {
        console.log('Error has occured: ' + err);
    }
    res.send('Cleared.');
});
app.get('/listpdfdata', function (req, res) {
    var uploads_folder = 'uploads';
    // console.log(upload.storage.getFilename);
    fs_1["default"].readdir(uploads_folder, function (err, files) {
        res.send(files);
    });
});
app.get('/listrootdata', function (req, res) {
    fs_1["default"].readdir(__dirname, function (err, files) {
        res.send(files);
    });
});
app.post('/fileupload', function (req, res) {
    console.log('file upload with AWS S3 invoked.');
    if (req.files.uploadedPdf != undefined) {
        uploadFileToAWS_1["default"](req.files.uploadedPdf)
            .then(function (resolvedMessage) { return res.send(resolvedMessage.status); })["catch"](function (rejectedMessage) { return res.send(rejectedMessage.status); });
    }
    else {
        res.send('Could not handle request. No recognized data attached.');
    }
});
app.get('/filedownload/:filetodownload', function (req, res) {
    console.log('... File download  with S3 invoked. ...');
    var newConfigParameters = JSON.parse(req.params.filetodownload);
    console.log(newConfigParameters);
    if (JSON.parse(req.params.filetodownload)['requestedFileName']) {
        downloadFileFromAWS_1["default"](JSON.parse(req.params.filetodownload)['requestedFileName'])
            .then(function (data) {
            // testPdfReaderCapabilty(data.Body);
            res.contentType("application/pdf; charset=utf-8");
            res.setHeader('Content-Length', data.ContentLength);
            res.end(data.Body);
        })["catch"](function (rejectedMessage) { return res.send(rejectedMessage); });
    }
    else {
        res.send('Could not handle request. Check for missing parameter {requestedFilename: fileToGet} in the URL.');
    }
});
app.use(function (err, req, res) {
    if (res.status != 200) {
        res.send('Sorry something has broken :(.');
        var reportToAdmin = new sendReport_1["default"](err, "ERROR");
        reportToAdmin.sendReport();
    }
});
if (process.env.NODE_ENV === 'production') {
    app.use(express_1["default"].static('client/build'));
}
app.listen(port, function () { return console.log("Express server running on " + port + "."); });
