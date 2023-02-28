import nodemailer from "nodemailer";

export const sendEmail = async(email,subject,message)=> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.HOST,
        pass: process.env.PASS
      },
    });

     transporter.sendMail({
      from: process.env.HOST,
      to: email,
      subject: subject,
      html: message
    });
    console.log("Email sent Successfully")
  }catch(error){
    console.log("Email not sent")
    console.log(error)
    return error;
  }
};
