"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var services_1 = __importDefault(require("./lib/services"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
//import fileUpload  = require("../node_modules/@types/express-fileupload");
var app = express_1["default"]();
var port = parseInt(process.env.PORT, 10) || 5050;
if (process.env.NODE_ENV === 'production') {
    app.use(cors_1["default"]());
}
else {
    app.use(cors_1["default"]({ origin: "http://localhost:3000" }));
}
app.get('/', function (req, res) {
    res.send('...Hello...');
});
app.post('/upload', express_fileupload_1["default"](), function (req, res) {
    // https://stackoverflow.com/questions/52140939/how-to-send-pdf-file-from-front-end-to-nodejs-server
    res.send('File uploaded');
});
app.get('/sliceservice', function (req, res) {
    services_1["default"].sliceService()
        .then(function (resultedReadStream) {
        res.contentType("application/pdf");
        res.send(resultedReadStream);
    });
});
app.listen(port, function () { return console.log("Express server running on " + port + "."); });
