const { generateToken } = require("../../helpers/jwt");
const nodemailer = require("nodemailer");
const email = process.env.NOREPLYEMAIL;
const pass = process.env.NOREPLYPASS;
const juice = require('juice')

function sendEmailRegister(req, res, next) {
    let user = req.payload;
    if(user.email) {
        let token = generateToken(user);
        let link = `http://${req.headers.host}/auth/verify/${token}`;
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass,
            },
        });
    
        const mailOptions = {
            from: email,
            to: user.email,
            subject: "Verifikasi Akun",
            html: juice(`
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 Transitional//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Register</title>
                    <style>
                    </style>
                </head>
                <body>
                    <div>
                        <h1>Email Verifications</h1>
                        <h2>Thanks For SIGN UP on Apotek , ${user.fullname}</h2>
                        <h5>
                            Click the “Account Activation Now” button below to complete the process of registering your account on Apotek.
                        </h5>
                        <button style="margin-top: 4vh">
                            <a href=${link}>Click Here</a>
                        </button>
                    </div>
                </body>
                </html>
            `)
        };
        transporter.sendMail(mailOptions, (error, status) => {
            if (error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(201).json({
                    message: `success`
                })
            }
        });
    }else{
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

module.exports = {
    sendEmailRegister,
};
