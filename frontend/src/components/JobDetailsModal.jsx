import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaTimes, FaBriefcase } from 'react-icons/fa';

const JobDetailsModal = ({ job, isOpen, onClose, onApply }) => {
    if (!isOpen || !job) return null;

    // Portal to body to avoid z-index/transform issues from parent components
    return ReactDOM.createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                    >
                        <FaTimes size={20} className="text-gray-600" />
                    </button>

                    <div className="p-8">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl font-bold text-indigo-600">
                                {job.company ? job.company.charAt(0) : '?'}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                                <p className="text-lg text-indigo-600 font-medium">{job.company || 'Unknown Company'}</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center text-center">
                                <FaMapMarkerAlt className="text-indigo-500 mb-1" />
                                <span className="text-sm font-medium text-gray-600">{job.location}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center text-center">
                                <FaMoneyBillWave className="text-green-500 mb-1" />
                                <span className="text-sm font-medium text-gray-600">{job.salary}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center text-center">
                                <FaBriefcase className="text-purple-500 mb-1" />
                                <span className="text-sm font-medium text-gray-600">{job.experienceLevel || 'Mid Level'}</span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center text-center">
                                <FaClock className="text-orange-500 mb-1" />
                                <span className="text-sm font-medium text-gray-600">{job.type || 'Full Time'}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Job Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                        </div>

                        {/* Skills */}
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Requirements</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills && Array.isArray(job.skills) ? (
                                    job.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500">No specific skills listed</span>
                                )}
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={onApply}
                                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition transform hover:-translate-y-0.5"
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default JobDetailsModal;
