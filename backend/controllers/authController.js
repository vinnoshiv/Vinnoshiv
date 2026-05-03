const jwt = require('jsonwebtoken');

const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, username, role: 'admin' });
};

const adminVerify = (req, res) => {
  res.json({ valid: true, admin: req.admin });
};

module.exports = { adminLogin, adminVerify };
