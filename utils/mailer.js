const nodeMailer = require("nodemailer");

const adminEmail = 'flasontesting@gmail.com';

const adminPassword = 'M@nhCuong1511'

const sendMail = async (to, subject, html) => {
    const transporter = await nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
        user: adminEmail,
        pass: adminPassword
        }
    });
    const mailOptions = {
        from: adminEmail,
        to,
        subject,
        html
    };
    await transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
        console.log(err);
        } else {
        console.log(info);
        }
    });
    };
module.exports = sendMail;