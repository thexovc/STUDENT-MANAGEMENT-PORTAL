const { join } = require('path');

const { tryCatch } = require(join(__dirname, '..', 'Utils', 'try_catch'));

const { Student } = require(join(
  __dirname,
  '..',
  'Models',
  'Student.model.js'
));

const Jimp = require('jimp');
const qrCode = require('qrcode');
const fs = require('fs');
const { AppError } = require('../Utils/appError');

const qrCodeGenerator = tryCatch(async (req, res, next) => {
  const foundStudent = await Student.findOne(
    { _id: req.user },
    { password: 0, emailAddress: 0 }
  );
  qrCode.toString(
    foundStudent,
    {
      errorCorrectionLevel: 'H',
      type: 'svg',
    },
    async function (err, data) {
      if (err) throw err;
      foundStudent.qrCode = data;
      await foundStudent.save();
      return res.status(201).json({
        success: true,
        message: 'Qrcode generation was successful',
        data: {},
      });
    }
  );
});

const qrCodeReader = tryCatch(async (req, res, next) => {
  const file = req.file;
  const filePath =
    (__dirname, '..', 'Utils', 'qrCodes', Date.now() + file.originalName);
  fs.writeFileSync(join(filePath), file.buffer);
  const buffer = fs.readFileSync(join(filePath));
  Jimp.read(buffer, function (err, image) {
    if (err) {
      return next(new AppError(err, 500));
    }
    const qrCodeInstance = new qrCodeReader();
    qrCodeInstance.callback = function (err, value) {
      if (err) {
        return next(new AppError(err, 500));
      }
      return res.status(200).json({
        success: true,
        message: 'Qrcode scanned successfully',
        data: value.result,
      });
    };
    qrCodeInstance.decode(image.bitmap);
  });
});
module.exports = {
  qrCodeGenerator,
  qrCodeReader,
};
