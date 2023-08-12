const nodemailer = require('nodemailer');

const sendMail = async (email, html) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Luyện thi toeic " <no-relpy@luyenthitoeic.com>',
        to: email,
        subject: 'Forgot password',
        html: html,
    });

    return info;
};

module.exports = sendMail;
