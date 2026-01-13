const express = require('express');
const { applyJob, getMyApplications, getJobApplications, checkApplicationStatus, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:jobId', protect, authorize('user'), applyJob);
router.get('/my', protect, getMyApplications);
router.get('/job/:jobId', protect, authorize('admin'), getJobApplications);
router.get('/check/:jobId', protect, authorize('user'), checkApplicationStatus);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
