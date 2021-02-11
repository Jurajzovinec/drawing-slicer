"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var nodemailer_1 = __importDefault(require("nodemailer"));
var SendReportMessageToAdmin = /** @class */ (function () {
    function SendReportMessageToAdmin(reportMessage, level) {
        this.reportMessage = reportMessage;
        this.level = level;
    }
    SendReportMessageToAdmin.prototype.sendReport = function () {
        var transporter = nodemailer_1["default"].createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: 'DrawingSlicerAppSender@outlook.com',
                pass: 'Hfca9Xyzx6vdCF5'
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });
        var mailOptions = {
            from: '"Drawing Slicer Reporter " <DrawingSlicerAppSender@outlook.com>',
            to: 'juraj.zovinecc@gmail.com',
            subject: 'Drawing Slicer Issue ' + this.level,
            text: 'Issue ' + this.level,
            html: '<b>Issue message: </b><br> ' + this.reportMessage
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    };
    return SendReportMessageToAdmin;
}());
exports["default"] = SendReportMessageToAdmin;
