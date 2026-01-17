const express = require('express');
const { getJobs, getJob, createJob, updateJob, deleteJob, submitFeedback } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getJobs)
    .post(protect, authorize('admin'), createJob);

router.route('/:id')
    .get(getJob)
    .put(protect, authorize('admin'), updateJob)
    .delete(protect, authorize('admin'), deleteJob);

router.post('/:id/feedback', protect, submitFeedback);

module.exports = router;
