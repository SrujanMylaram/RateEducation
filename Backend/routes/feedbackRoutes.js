const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.post('/', verifyToken, feedbackController.submitFeedback);
router.get('/',  feedbackController.getAllFeedbacks);
// Route to get average ratings for all faculties
router.get('/faculty/ratings', feedbackController.getFacultyRatings);


module.exports = router;
