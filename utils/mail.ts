import nodemailer from 'nodemailer'

export function sendEmail(address:string,title:string,content:string)
{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.mail,
            pass: process.env.app_pass
        }
    })

    const mailOptions = {
        from: process.env.mail,
        to: address,
        subject: title,
        text: content
    };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
}