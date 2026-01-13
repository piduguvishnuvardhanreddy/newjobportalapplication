const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resume: {
        type: String,
        required: [true, 'Please provide a resume URL']
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'interview', 'rejected', 'hired'],
        default: 'applied'
    },
    note: {
        type: String,
        default: ''
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
