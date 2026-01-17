const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (User only)
exports.applyJob = async (req, res) => {
    try {
        const { resume } = req.body;
        const jobId = req.params.jobId;

        // Check if job exists & is active
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        if (new Date(job.deadline) < new Date()) {
            return res.status(400).json({ message: 'Job application deadline has passed' });
        }

        // Check if already applied
        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user.id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            resume
        });

        res.status(201).json({
            success: true,
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's applied jobs
// @route   GET /api/applications/my
// @access  Private (User only)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', 'title location deadline status')
            .sort('-appliedAt');

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Admin only)
exports.getJobApplications = async (req, res) => {
    try {
        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email')
            .sort('-appliedAt');

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Check if user has applied for a job
// @route   GET /api/applications/check/:jobId
// @access  Private
exports.checkApplicationStatus = async (req, res) => {
    try {
        const hasApplied = await Application.exists({
            job: req.params.jobId,
            applicant: req.user.id
        });

        res.status(200).json({
            success: true,
            hasApplied: !!hasApplied
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status, note },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Send Email Notification
        const emailService = require('../services/emailService');
        // Populate to get email
        await application.populate('applicant', 'name email');
        await application.populate('job', 'title');

        emailService.sendApplicationUpdateEmail(application.applicant, status, application.job.title)
            .catch(err => console.error('Status email failed:', err));

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
