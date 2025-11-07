const db = require('../config/db');

exports.submitFeedback = (req, res) => {
  const { course_id, teachingSkills, punctuality, clarity, communication, comment } = req.body;
  const user_id = req.user.id;

  // Validate input
  if (
    !course_id ||
    !teachingSkills || !punctuality || !clarity || !communication ||
    teachingSkills < 1 || teachingSkills > 5 ||
    punctuality < 1 || punctuality > 5 ||
    clarity < 1 || clarity > 5 ||
    communication < 1 || communication > 5
  ) {
    return res.status(400).json({ message: 'Invalid input. Ratings must be 1-5 and all fields are required.' });
  }

  // First, check if feedback already exists for this user and course
  db.query(
    `SELECT * FROM feedback WHERE user_id = ? AND course_id = ?`,
    [user_id, course_id],
    (err, results) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (results.length > 0) {
        // Feedback already exists
        return res.status(400).json({ message: 'You have already submitted feedback for this course' });
      }

      // If not exists, insert feedback
      const overall = (teachingSkills + punctuality + clarity + communication) / 4;

      db.query(
        `INSERT INTO feedback (user_id, course_id, teachingSkills, punctuality, clarity, communication, overall, comment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, course_id, teachingSkills, punctuality, clarity, communication, overall, comment],
        (err) => {
          if (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
          }
          res.status(201).json({ message: 'Feedback submitted successfully' });
        }
      );
    }
  );
};


exports.getAllFeedbacks = (req, res) => {
  const query = `
    SELECT 
      f.id,
      u.name AS student_name,
      u.email AS student_email,
      c.name AS course_name,
      c.faculty AS faculty_name,
      f.teachingSkills AS teaching_skills,
      f.punctuality,
      f.clarity,
      f.communication,
      f.overall AS overall_rating,
      f.comment,
      f.created_at
    FROM feedback f
    JOIN users u ON f.user_id = u.id
    JOIN courses c ON f.course_id = c.id
    ORDER BY f.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('\n❌ SQL ERROR:', err.sqlMessage);
      return res.status(500).json({ message: 'Database error', error: err.sqlMessage });
    }

    res.json(results);
  });
};



// Get average rating for each faculty
exports.getFacultyRatings = (req, res) => {
  const query = `
    SELECT 
      c.faculty AS faculty_name,
      AVG((f.teachingSkills + f.punctuality + f.clarity + f.communication)/4) AS average_rating
    FROM feedback f
    JOIN courses c ON f.course_id = c.id
    GROUP BY c.faculty
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
};
