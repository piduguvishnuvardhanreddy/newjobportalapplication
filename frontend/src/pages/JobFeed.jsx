import { useState, useEffect } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const JobFeed = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (searchTerm) queryParams.append('search', searchTerm);
            if (locationTerm) queryParams.append('location', locationTerm);

            const url = `/jobs?${queryParams.toString()}`;
            console.log('Fetching jobs from:', url);
            const { data } = await api.get(url);
            setJobs(data.jobs);
        } catch (error) {
            console.error('Search Error:', error);
            const msg = error.response?.data?.message || 'Failed to load jobs';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search (Run this instead of the initial mount useEffect)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchJobs();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, locationTerm]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Latest Job Openings</h1>

            {/* Search Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 border border-gray-100">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Search by Job Role"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Filter by Location"
                        value={locationTerm}
                        onChange={(e) => setLocationTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading jobs...</div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <motion.div key={job._id} variants={item}>
                                <JobCard job={job} isAdmin={false} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default JobFeed;
