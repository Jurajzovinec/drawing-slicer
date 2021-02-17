import nodemailer from 'nodemailer';
import config from '../config';

export default class SendReportMessageToAdmin {
    constructor(
        private reportMessage: string,
        private level: "INFO" | "DEBUG" | "ERROR" | "CRITICAL",
    ) {
    }

    sendReport() {

        let transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
                user: config.NODE_MAILER_ACC,
                pass: config.NODE_MAILER_PASS
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        })

        let mailOptions = {
            from: `"Drawing Slicer Reporter " <${config.NODE_MAILER_ACC}>`, 
            to: config.NODE_MAILER_ADMIN_ACC, 
            subject: 'Drawing Slicer Issue '+ this.level, 
            text: 'Issue ' + this.level,
            html: '<b>Issue message: </b><br> ' + this.reportMessage 
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
}




