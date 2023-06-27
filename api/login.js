// Import the `cors` function
const cors = require('../cors');

module.exports = (req, res) => {
  if (req.method === 'OPTIONS') {
    // Handle preflight requests
    cors(req, res);
    return;
  }

  // Add your logic to handle the actual request here

  // Example response
  res.status(200).json({ message: 'Login Cors successful.' });
};
