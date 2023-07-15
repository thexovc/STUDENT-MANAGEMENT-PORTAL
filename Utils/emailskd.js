const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
// const puppeteer = require('puppeteer-core');
// const { jsPDF } = require('jspdf');
// const PDFDocument = require('pdfkit');
// const pdfkitHtmlSimple = require('@shipper/pdfkit-html-simple');
const pdfMake = require('pdfmake');
const pdfshift = require('pdfshift');
const html2pdf = require('html-pdf');

const axios = require('axios');

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
    // Read the HTML template file
    const templateFilePath = 'email-templates/uploadPdf.html';
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

    // Convert the HTML to PDF using html-pdf
    const pdfData = await html2pdf.convert(renderedTemplate);

    // Save the PDF data to a file
    const outputFilePath = 'output.pdf';
    fs.writeFileSync(outputFilePath, pdfData);

    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'SMP Registration Slip',
      html: renderedTemplate,
      attachments: [
        {
          filename: 'smp_registration_slip.pdf',
          path: outputFilePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
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
