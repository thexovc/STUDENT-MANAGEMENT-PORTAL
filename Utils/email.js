const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Ready for Message ');
    console.log(success);
  }
});

const handlebarOptions = {
  viewEngine: {
    defaultLayout: false,
    extName: '.hbs',
    partialsDir: path.resolve(__dirname, '..', 'email-templates'),
  },
  viewPath: path.resolve(__dirname, '..', 'email-templates'),
  extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

const sendForgotPasswordEmail = async ({ email, password }) => {
  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: `${email}`,
    subject: 'Password Recovery',
    template: 'forgotPassword',
    context: {
      password,
    },
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        resolve(false);
      } else {
        resolve(true);
        console.log(`Email sent: ${info.response}`);
      }
    });
  });
};

module.exports = {
  sendForgotPasswordEmail,
};
