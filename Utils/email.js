const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');
const handlebars = require('handlebars');

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

const sendPDFEmail = async ({ email, password }) => {
  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: `${email}`,
    subject: 'PDF',
    template: 'pdf',
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

const sendEmailPDFUpload = async ({
  email,
  fullName,
  matricNo,
  session,
  studentId,
}) => {
  try {
    const templateFilePath = 'email-templates/uploadPdf.html';

    // Read the HTML template file
    const templateData = await fs.promises.readFile(templateFilePath, 'utf8');

    const compiledTemplate = handlebars.compile(templateData);

    // Render the email template with dynamic values using Handlebars
    const renderedTemplate = compiledTemplate({
      email,
      fullName,
      matricNo,
      session,
      studentId,
    });

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'SMP Registration Slip',
      html: renderedTemplate,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendForgotPasswordEmail,
  sendPDFEmail,
  sendEmailPDFUpload,
};
