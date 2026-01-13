import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaRegClock, FaTrash } from 'react-icons/fa';

import { motion } from 'framer-motion';

const JobCard = ({ job, isAdmin, onDelete }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        >
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <Link to={`/jobs/${job._id}`} className="block hover:underline">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                        </Link>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {job.location}
                        </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.jobType === 'Full-time' ? 'bg-green-100 text-green-800' :
                        job.jobType === 'Part-time' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {job.jobType}
                    </span>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500 line-clamp-3">
                        {job.description}
                    </p>
                </div>
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center">
                <div className="text-xs text-gray-500 flex items-center">
                    <FaRegClock className="mr-1" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                </div>

                {isAdmin ? (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(job._id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center"
                    >
                        <FaTrash className="mr-1" /> Delete
                    </motion.button>
                ) : (
                    <Link to={`/jobs/${job._id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                        View Details &rarr;
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

export default JobCard;
