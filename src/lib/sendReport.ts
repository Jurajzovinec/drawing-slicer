import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

export default class SendReportMessageToAdmin {
    constructor(
        private reportMessage: string,
        private level: "INFO" | "DEBUG" | "ERROR" | "CRITICAL",
    ) {
    }

    sendReport() {

        const transporter = nodemailer.createTransport({
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
        })

        const mailOptions = {
            from: `"Drawing Slicer Reporter " <${process.env.NODE_MAILER_ACC}>`, 
            to: process.env.NODE_MAILER_ADMIN_ACC, 
            subject: 'Drawing Slicer Issue '+ this.level, 
            text: `Issue level: ${this.level}`,
            html: `<b>Issue message: </b><br> Issue level: ${this.level} </b><br> ${this.reportMessage}`  
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
}




