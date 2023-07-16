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
  // Define the file path for the HTML template
  const templateFilePath = 'email-templates/uploadPdf.html';

  // Read the HTML template file
  fs.readFile(templateFilePath, 'utf8', (err, templateData) => {
    if (err) {
      console.error('Error reading HTML template:', err);
      // return res.status(500).json({ error: 'Error reading HTML template' });
      return undefined;
    }

    const compiledTemplate = handlebars.compile(templateData);

    // Render the email template with dynamic values using EJS
    const renderedTemplate = compiledTemplate({
      email,
      fullName,
      matricNo,
      session,
      studentId,
    });

    // Generate the PDF from the rendered template
    pdf.create(renderedTemplate).toBuffer((pdfErr, buffer) => {
      if (pdfErr) {
        console.error('Error generating PDF:', pdfErr);
        return undefined;
        // return res.status(500).json({ error: 'Error generating PDF' });
      }

      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: `${email}`,
        subject: 'SMP Registration Slip',
        template: 'upload',
        context: {
          email,
          fullName,
          matricNo,
          session,
          studentId,
        },
        attachments: [
          {
            filename: 'smp_registration_slip.pdf',
            content: buffer,
          },
        ],
      };

      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (sendErr, info) => {
          if (sendErr) {
            console.error('Error sending email:', sendErr);
            resolve(false);
            return undefined;
            // return res.status(500).json({ error: 'Error sending email' });
          }

          console.log('Email sent successfully:', info.response);
          resolve(true);
          return info;
          // res.json({ message: 'Email sent successfully' });
        });
      });
    });
  });
};

module.exports = {
  sendForgotPasswordEmail,
  sendPDFEmail,
  sendEmailPDFUpload,
};
