"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var multer_1 = __importDefault(require("multer"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var uuid_1 = require("uuid");
var sliceService_1 = __importDefault(require("./lib/sliceService"));
var inputTestService_1 = __importDefault(require("./lib/inputTestService"));
var storage = multer_1["default"].diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname;
        cb(null, uuid_1.v4() + "-" + originalname);
    }
});
var upload = multer_1["default"]({ storage: storage });
var app = express_1["default"]();
var port = parseInt(process.env.PORT, 10) || 5050;
if (process.env.NODE_ENV === 'production') {
    app.use(cors_1["default"]());
}
else {
    app.use(cors_1["default"]({ origin: "http://localhost:3000" }));
}
app.use(express_1["default"].static('public'));
app.post('/test/:params', upload.single('file'), function (req, res) {
    var testSliceService = new inputTestService_1["default"](req.file.filename);
    console.log('Here it still works...');
    testSliceService.runService()
        .then(function (response) { return res.send(response); })["catch"](function (err) { return res.send(err); });
});
app.get('/resultdata', function (req, res) {
    res.contentType("application/pdf");
    res.send(fs_1["default"].readFileSync(req.headers.requestedfile.toString()));
});
app.get('/clearpdfdata', function (req, res) {
    var directory = 'uploads';
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
});
app.post('/slice/:params', upload.single('file'), function (req, res) {
    var postedParams = JSON.parse(req.params.params);
    console.log(postedParams);
    var testSliceService = new sliceService_1["default"](req.file.filename, (postedParams.ScaleBeforeSlice === 'true') ? postedParams.ScaleToFormat : "none", postedParams.SliceByFormat);
    console.log('Here it still works...');
    testSliceService.runService()
        .then(function (response) { return res.send(response); })["catch"](function (err) { return res.send(err); });
});
app.listen(port, function () { return console.log("Express server running on " + port + "."); });
