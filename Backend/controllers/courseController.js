const db = require('../config/db'); // ensure db.js exports a MySQL connection

exports.getAllCourses = (req, res) => {
  const query = 'SELECT * FROM courses ORDER BY id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching courses:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
};

exports.addCourse = (req, res) => {
  const { name, faculty, code } = req.body;

  if (!name || !faculty || !code) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the course code already exists
  const checkQuery = 'SELECT * FROM courses WHERE code = ?';
  db.query(checkQuery, [code], (err, results) => {
    if (err) {
      console.error('Error checking existing course:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    // Insert new course
    const insertQuery = 'INSERT INTO courses (name, faculty, code) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, faculty, code], (err, result) => {
      if (err) {
        console.error('Error inserting course:', err);
        return res.status(500).json({ message: 'Failed to add course' });
      }
      res.json({ message: 'Course added successfully', id: result.insertId });
    });
  });
};
