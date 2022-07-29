let nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = (email, role, name, generatedPassword) => {
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "თქვენ წარმატებით დარეგისტრირდით CRM-ზე",
    text: `თქვენ გაქვთ მინიჭებული ${
      role == 1 ? "ადმინისტრატორის" : "მენეჯერის"
    } როლი. თქვენი მონაცემებია 
              დასახელება: ${name} ელ.ფოსტა: ${email} პაროლი: ${generatedPassword}`, // plain text body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("email Sent");
    }
  });
};

module.exports = { sendMail };
