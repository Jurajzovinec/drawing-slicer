import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { sendReportObject } from './types/nodeMailer';

dotenv.config();

export default function sendReport(args: sendReportObject): void {

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
        from: `Drawing Slicer Reporter <${process.env.NODE_MAILER_ACC}>`,
        to: process.env.NODE_MAILER_ADMIN_ACC,
        subject: `Drawing Slicer Issue ${args.level}`,
        text: `Issue level: ${args.level}`,
        html: `<b>Issue message: </b><br> Issue level: ${args.level} </b><br> ${args.reportMessage}`
    };

    transporter.sendMail(mailOptions,  (err, info) => {
        if (err) {
            return console.log(err);
        }
        console.log('Message sent: ' + info.response);
    });

}


