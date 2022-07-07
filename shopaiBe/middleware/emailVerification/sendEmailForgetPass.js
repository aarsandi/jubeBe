const nodemailer = require("nodemailer");
const email = process.env.NOREPLYEMAIL;
const pass = process.env.NOREPLYPASS;
const juice = require('juice')

function sendEmailForgetPass(req, res, next) {
    let user = req.payload;
    if(user.email) {
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
            subject: "Forgot Password",
            html: juice(`
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 Transitional//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Forgot Password</title>
                    <style>
                    </style>
                </head>
                <body>
                    <div>
                        <h1>Forgot Password</h1>
                        <h2>Hello , ${user.fullname}</h2>
                        <h5>Your new password is ${user.password}</h5>
                        <h5>Please login with your new password</h5>
                    </div>
                </body>
                </html>
            `)
        };
        transporter.sendMail(mailOptions, (error, status) => {
            if (error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(200).json({ message: "success", data: { id: user.id, password: user.password } });
            }
        });
    }else{
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

module.exports = {
    sendEmailForgetPass,
};
