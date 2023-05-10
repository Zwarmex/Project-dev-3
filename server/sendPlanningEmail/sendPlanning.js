const { createTransport } = require('nodemailer');

const sendPlanning = async (planning, mailUser) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: mailUser,
    subject: 'Votre planning de repas',
    text: generateEmailText(planning),
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const generateEmailText = (planning) => {
  let emailText = 'Voici votre planning de repas:\n\n';

  planning.forEach((item) => {
    emailText += `${item.date}: ${item.recipe.labelRec}\n`;
    emailText += `${item.recipe.descRec}\n\n`;
  });

  return emailText;
};

module.exports = {
  sendPlanning,
};
