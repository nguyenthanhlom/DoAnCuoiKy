const nodemailer = require('nodemailer');

async function send(to, subject, content) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'tlom.wed2@gmail.com',
            pass: 'Lom161199',
        }
    });

    return transporter.sendMail({
        from: 'tlom.wed2@gmail.com',
        to,
        subject,
        text: content,
    });
}

module.exports = { send };