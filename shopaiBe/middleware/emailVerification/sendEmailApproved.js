const nodemailer = require("nodemailer");
const email = process.env.NOREPLYEMAIL;
const pass = process.env.NOREPLYPASS;
const juice = require('juice')

function sendEmailApproved (req, res, next) {
    let user = req.payload;
    if(user.email) {
        let link = `http://${req.headers.host}/auth/loginDoctor`;
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

        const mailOptions = user.status == 'approved'?{
            from: email,
            to: user.email,
            subject: "Account Approved",
            html: juice(`
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 Transitional//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Account Approved</title>
                    <style>
                    </style>
                </head>
                <body>
                    <div>
                        <h1>Account Approved</h1>
                        <h2>Thanks For SIGN UP on ApotekPendidikan , ${user.fullname}</h2>
                        <h5>Username: ${user.username}</h5>
                        <h5>Password: ${user.password}</h5>
                    </div>
                </body>
                </html>
            `)
        }:{
            from: email,
            to: user.email,
            subject: "Account Rejected",
            html: juice(`
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1 Transitional//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Account Rejected</title>
                    <style>
                    </style>
                </head>
                <body>
                    <div>
                        <h1>Account Rejected</h1>
                        <h2>Hello , ${user.fullname}</h2>
                        <h5>Your account has been rejected by our admin</h5>
                    </div>
                </body>
                </html>
            `)
        };
        transporter.sendMail(mailOptions, (error, status) => {
            if (error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(200).json({ message: "success", data: { id: user.id, username: user.username, status: user.status } });
            }
        });
    }else{
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

module.exports = {
    sendEmailApproved,
};

