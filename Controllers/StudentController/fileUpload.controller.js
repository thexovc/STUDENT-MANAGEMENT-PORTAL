const { Student } = require('../../Models/Student.model');
const pdfParse = require('pdf-parse');

const uploadPDF = async (req, res) => {
  const pdfFile = req.file;

  const { studentEmail } = req.body;

  console.log({ studentEmail });

  try {
    pdfParse(pdfFile.buffer)
      .then(async (data) => {
        const extractedData = data.text;
        // Process the extracted data as needed
        const nameRegex = /Name:\s*([A-Za-z\s]+)/;
        const sessionString = 'Session:\\s*\\d{4}';

        const sessionCode = new RegExp(sessionString);

        const courseCodes = /(CSC|MTH|PHY|GST|CED)\s*/;
        const matCodes = /PSC\d{6}/;
        const emailCode = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const yearRegex =
          /^Course Result Slip (1\d{2}|2\d{2}|3\d{2}|400) \(Year [1-4]\)$/;

        let name = '';
        let matriculationNo = '';
        let emailAddress = '';
        let year = '';
        let session = '';
        let courses = [];

        const strings = extractedData.split('\n');

        // Loop over each string and search for matches

        strings.forEach((string) => {
          if (nameRegex.test(string)) {
            // Match found for name
            name = string.slice(5);
          }
          if (sessionCode.test(string)) {
            session = string.slice(8);
          }
          if (courseCodes.test(string)) {
            const matchCourse = string.slice(0, 6);
            const matchName = string.slice(6, -7);
            const regex = /\d{3}/;
            const hasThreeNumbers = regex.test(matchCourse);

            if (hasThreeNumbers) {
              courses.push({
                code: matchCourse,
                name: matchName,
                credit: `3 credit`,
              });
            }
          }
          if (matCodes.test(string)) {
            const modifiedStr = string
              .replace(/^Matriculation Number:/, '')
              .trim();

            matriculationNo = modifiedStr;
          }
          if (emailCode.test(string)) {
            const email = string.replace(/^Email:\s*/, '');

            emailAddress = email;
          }
          if (yearRegex.test(string)) {
            let key = ['100', '200', '300', '400'];
            let arr = string.split(' ');

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
        });

        const studentDB = await Student.findOne({ emailAddress, year });

        if (studentDB) {
          // res.status(400).send({ msg: 'Student already exist!' });
          res.send(studentDB);
        } else {
          const newStudent = await Student.create({
            fullName: name,
            emailAddress: `${studentEmail}`,
            matriculationNo,
            courses,
            year,
            session,
          });
          // console.log(newStudent);
          res.send(newStudent);
        }
        // res.send('eorkk');

        // // console.log(name, courses, matriculationNo, emailAddress, year, session);
      })
      .catch((error) => {
        // Handle errors
        res.status(500).json({
          error: 'An error occurred while parsing the PDF.',
          msg: error,
        });
      });
  } catch (error) {
    res.status(400).send('an error occured');
  }
};

module.exports = {
  uploadPDF,
};
