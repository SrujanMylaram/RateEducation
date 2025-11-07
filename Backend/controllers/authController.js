const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0)
      return res.status(400).json({ message: 'Invalid credentials (user not found)' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials (wrong password)' });

    // 🔐 Ensure role matches
    if (role && user.role !== role) {
      return res.status(403).json({ message: `Access denied. You are not an ${role}.` });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  });
};



exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // 2️⃣ Check if email already exists
    const [existing] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert into database
    const [result] = await db
      .promise()
      .query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role || 'student']
      );

    // 5️⃣ Return success response
    const user = {
      id: result.insertId,
      name,
      email,
      role: role || 'student',
    };

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
