import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaExternalLinkAlt } from 'react-icons/fa';

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await api.get('/applications/my');
                setApplications(data.applications);
            } catch (error) {
                toast.error('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) return <div className="text-center py-10">Loading applications...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <li key={app._id}>
                                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg leading-6 font-medium text-indigo-600 truncate">
                                            {app.job?.title || 'Job Removed'}
                                        </h3>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${app.status === 'applied' ? 'bg-gray-100 text-gray-800' :
                                                    app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                                                        app.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                                                            app.status === 'hired' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {app.job?.location}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex flex-col items-end text-sm text-gray-500 sm:mt-0">
                                            <p>
                                                Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                            </p>
                                            {app.note && (
                                                <p className="mt-1 text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded">
                                                    Note: {app.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-500 text-sm hover:underline flex items-center">
                                            <FaExternalLinkAlt className="mr-1" /> View Resume
                                        </a>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-10 text-center text-gray-500">
                            You haven't applied to any jobs yet.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AppliedJobs;
