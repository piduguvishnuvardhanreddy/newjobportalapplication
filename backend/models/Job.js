const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title']
    },
    description: {
        type: String,
        required: [true, 'Please add a job description']
    },
    skills: {
        type: [String],
        required: [true, 'Please add required skills']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: [true, 'Please select job type']
    },
    deadline: {
        type: Date,
        required: [true, 'Please add an application deadline']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);
