const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
async function sendMail(to, subject, content) {

    var transporter = nodemailer.createTransport(smtpPool({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME || 'ngochaitu2@gmail.com',
            pass: process.env.EMAIL_PASSWORD || '01689083868'
        }
    }));

    return await transporter.sendMail({
        from: 'SP Bank',
        to,
        subject,
        html: content
    });
}

module.exports = { sendMail };