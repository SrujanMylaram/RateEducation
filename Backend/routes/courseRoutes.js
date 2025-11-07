const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Use the correct function names from your controller
router.get('/', courseController.getAllCourses);
router.post('/', courseController.addCourse);

module.exports = router;

