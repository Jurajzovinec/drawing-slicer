"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var sliceService_1 = __importDefault(require("./lib/sliceService"));
var inputTestService_1 = __importDefault(require("./lib/inputTestService"));
var multer_1 = __importDefault(require("multer"));
var uuid_1 = require("uuid");
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
app.post('/upload/:params', upload.single('file'), function (req, res) {
    var newConfigParameters = JSON.parse(req.params.params);
    console.log(newConfigParameters);
    var uploadSliceService = new sliceService_1["default"](req.file.filename, "a4", "none");
    uploadSliceService.runService()
        .then(function (resultedReadStream) {
        res.contentType("application/pdf");
        res.send(resultedReadStream);
    })["catch"](function (err) { res.send({ ErrorMsg: err['ErrorMessage'] }); });
});
app.post('/test/:params', upload.single('file'), function (req, res) {
    var newConfigParameters = JSON.parse(req.params.params);
    console.log(newConfigParameters);
    var uploadSliceService = new inputTestService_1["default"](req.file.filename);
    uploadSliceService.runService()
        .then(function (outputMessage) { return res.send(outputMessage); })["catch"](function (err) { res.send({ ErrorMsg: err['ErrorMessage'] }); });
});
app.get('/', function (req, res) {
    res.send('...Hello...');
});
app.listen(port, function () { return console.log("Express server running on " + port + "."); });
