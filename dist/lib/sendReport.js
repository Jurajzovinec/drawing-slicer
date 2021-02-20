"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var nodemailer_1 = __importDefault(require("nodemailer"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
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
                user: process.env.NODE_MAILER_ACC,
                pass: process.env.NODE_MAILER_PASS
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });
        var mailOptions = {
            from: "\"Drawing Slicer Reporter \" <" + process.env.NODE_MAILER_ACC + ">",
            to: process.env.NODE_MAILER_ADMIN_ACC,
            subject: 'Drawing Slicer Issue ' + this.level,
            text: "Issue level: " + this.level,
            html: "<b>Issue message: </b><br> Issue level: " + this.level + " </b><br> " + this.reportMessage
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
