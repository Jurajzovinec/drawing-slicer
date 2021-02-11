import nodemailer from 'nodemailer';

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
                user: 'DrawingSlicerAppSender@outlook.com',
                pass: 'Hfca9Xyzx6vdCF5'
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        })

        let mailOptions = {
            from: '"Drawing Slicer Reporter " <DrawingSlicerAppSender@outlook.com>', 
            to: 'juraj.zovinecc@gmail.com', 
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




