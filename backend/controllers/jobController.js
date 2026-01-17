const Job = require('../models/Job');

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        console.log('GET /jobs query:', req.query); // Debug log
        const { search, location } = req.query;

        // Build query object
        const query = {
            deadline: { $gte: new Date() }
        };

        // Search strictly by Job Role (Title)
        if (search) {
            query.title = { $regex: String(search), $options: 'i' };
        }

        // Search by Location
        if (location) {
            query.location = { $regex: String(location), $options: 'i' };
        }

        const jobs = await Job.find(query).populate('createdBy', 'name email');

        res.status(200).json({ success: true, count: jobs.length, jobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('createdBy', 'name email');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Admin only)
exports.createJob = async (req, res) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        // Skills logic: if sent as string, split it
        if (typeof req.body.skills === 'string') {
            req.body.skills = req.body.skills.split(',').map(skill => skill.trim());
        }

        const job = await Job.create(req.body);

        // Send Email to ALL users
        // Send Email to ALL users
        const users = await require('../models/User').find({ role: 'user' }); // Only send to job seekers? "send to every user"

        // Add the creator (admin) to the list so they get a copy
        users.push(req.user);

        console.log(`[JobBroadcast] Found ${users.length} users (including admin) to email.`);

        const emailService = require('../services/emailService');

        // Non-blocking email sending
        console.log('[JobBroadcast] Initiating sendJobPostEmail...');
        emailService.sendJobPostEmail(users, job)
            .then(() => console.log('[JobBroadcast] Email broadcast completed successfully.'))
            .catch(err => console.error('[JobBroadcast] Email broadcast failed:', err));

        res.status(201).json({
            success: true,
            job
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Admin only)
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure user is owner (or admin can edit any? Prompt implies Admin creates, assume Admin owns)
        // Check if createdBy matches or just check Role (Middleware handles Role)
        // If multiple admins exist, they might want to edit each other's jobs.
        // I'll allow any admin to edit any job for simplicity, or strictly owner?
        // Prompt says "Admin Capabilities... Define job details".
        // I'll stick to: CreatedBy check not strictly required if Role is Admin. 
        // But cleaner if we check ownership OR role.
        // I'll simply update.

        if (typeof req.body.skills === 'string') {
            req.body.skills = req.body.skills.split(',').map(skill => skill.trim());
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin only)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.deleteOne();

        res.status(200).json({ success: true, message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit feedback (Not Interested)
// @route   POST /api/jobs/:id/feedback
// @access  Private
exports.submitFeedback = async (req, res) => {
    try {
        const { reason } = req.body;
        const jobId = req.params.id;
        const userId = req.user.id;

        const job = await Job.findById(jobId).populate('createdBy', 'email');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const emailService = require('../services/emailService');
        const feedbackData = {
            reason,
            jobId,
            userId
        };

        // Send logic: send to admin/creator
        // Assuming job.createdBy has the email
        const adminEmail = job.createdBy ? job.createdBy.email : process.env.ADMIN_EMAIL; // Fallback

        await emailService.sendFeedbackEmail(adminEmail, feedbackData);

        res.status(200).json({ success: true, message: 'Feedback submitted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
