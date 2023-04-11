const path = require('path');

const PDFExtract = require('pdf.js-extract').PDFExtract;

const { Student } = require(path.join(
  __dirname,
  '..',
  '..',
  'Models',
  'Student.model'
));

const uploadPDF = async (req, res) => {
  try {
    const pdfData = req.body;

    // Initialize the PDFExtract object
    const pdfExtract = new PDFExtract();

    // Set up the options for PDFExtract
    const options = {
      type: 'text',
    };

    // Extract the text from the PDF file
    await pdfExtract.extractBuffer(pdfData, options).then(async (data) => {
      // Send the extracted text back as the response

      // res.send(data);

      const courseCodes = /(CSC|MTH|PHY|GST|CED)\d+/;
      const matCodes = /(PSC)\d+/;
      const emailCode = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const yearRegex =
        /^Course Result Slip (1\d{2}|2\d{2}|3\d{2}|400) \(Year [1-4]\)$/;

      let matriculationNo = '';
      let emailAddress = '';
      let year = '';
      let courses = [];

      for (let i = 0; i < data['pages'].length; i++) {
        const dataArray = data['pages'][i]['content'];

        for (let i = 0; i < dataArray.length; i++) {
          let item = dataArray[i];
          if (courseCodes.test(item.str)) {
            courses.push(item.str);
          }
          if (matCodes.test(item.str)) {
            matriculationNo = item.str;
          }
          if (emailCode.test(item.str)) {
            emailAddress = item.str;
          }
          if (yearRegex.test(item.str)) {
            let key = ['100', '200', '300', '400'];
            let arr = item.str.split(' ');

            for (let i = 0; i < arr.length; i++) {
              let bool = false;
              for (let j = 0; j < key.length; j++) {
                if (arr[i] === key[j]) {
                  bool = true;
                  year = arr[i];
                  break;
                }
              }
              if (bool == true) {
                break;
              }
            }
          }
        }
      }

      const studentDB = await Student.findOne({ emailAddress, year });

      if (studentDB) {
        res.status(400).send({ msg: 'Student already exist!' });
      } else {
        const newStudent = await Student.create({
          fullName: 'tina',
          emailAddress,
          matriculationNo,
          courses,
          year,
        });
        res.send(newStudent);
      }

      //   res.send(201);

      console.log(courses, matriculationNo, emailAddress, year);
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  uploadPDF,
};
