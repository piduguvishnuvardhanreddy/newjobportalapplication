import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaRegComments } from 'react-icons/fa';
import api from '../api/axios';
import { toast } from 'react-toastify';

const FeedbackModal = ({ jobId, isOpen, onClose }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(`/jobs/${jobId}/feedback`, { reason });
            toast.success('Thank you for your feedback!');
            onClose();
        } catch (error) {
            toast.error('Failed to submit feedback');
        } finally {
            setLoading(false);
            setReason('');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <FaRegComments className="text-indigo-500" />
                            Not Interested?
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="text-gray-600 mb-4 text-sm">
                            Help us improve your recommendations. Why is this job not a good fit?
                        </p>

                        <div className="space-y-3 mb-6">
                            {['Salary too low', 'Location mismatch', 'Not my role', 'Company reputation', 'Other'].map((option) => (
                                <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={option}
                                        checked={reason === option}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-gray-700 text-sm">{option}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!reason || loading}
                                className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition ${!reason || loading
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
                                    }`}
                            >
                                {loading ? 'Sending...' : 'Send Feedback'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FeedbackModal;
