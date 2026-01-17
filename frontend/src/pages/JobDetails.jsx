import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resumeLink, setResumeLink] = useState('');
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchJobAndStatus = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data.job);

                // If user is logged in, check application status
                if (user && user.role === 'user') {
                    try {
                        const statusRes = await api.get(`/applications/check/${id}`);
                        setHasApplied(statusRes.data.hasApplied);
                    } catch (err) {
                        console.error("Failed to check status", err);
                    }
                }
            } catch (error) {
                toast.error('Failed to load job details');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchJobAndStatus();
    }, [id, navigate, user]);

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);
        try {
            await api.post(`/applications/${id}`, { resume: resumeLink });
            toast.success('Application submitted successfully!');
            navigate('/applied-jobs');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Application failed');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (!job) return null;

    const isExpired = new Date(job.deadline) < new Date();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link to="/" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                <FaArrowLeft className="mr-2" /> Back to Jobs
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                {job.companyLogo && (
                                    <img src={job.companyLogo} alt={job.company} className="w-16 h-16 object-contain rounded-md bg-gray-50 p-1" />
                                )}
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                                    <p className="text-lg text-gray-600 font-medium">{job.company}</p>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-4 text-gray-500">
                                <span className="flex items-center"><FaBriefcase className="mr-1" /> {job.jobType}</span>
                                <span className="flex items-center"><FaMapMarkerAlt className="mr-1" /> {job.location}</span>
                                {job.salary && <span className="flex items-center font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">Salary: {job.salary}</span>}
                                {job.openings && <span className="flex items-center text-gray-700 bg-gray-100 px-2 py-0.5 rounded">Openings: {job.openings}</span>}
                                {job.workLocation && <span className="flex items-center text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{job.workLocation}</span>}
                                <span className="flex items-center"><FaCalendarAlt className="mr-1" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                            {job.serviceAgreement && (
                                <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-2">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                <span className="font-bold">Notice:</span> This job requires a Service Agreement.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {isExpired && (
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                Closed
                            </span>
                        )}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.skills && Array.isArray(job.skills) && job.skills.length > 0 ? (
                                job.skills.map((skill, index) => (
                                    <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-500">No specific skills required.</span>
                            )}
                        </div>
                    </div>

                    {user && user.role === 'user' && !isExpired && (
                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Apply for this Position</h3>
                            {hasApplied ? (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Already Applied!</strong>
                                    <span className="block sm:inline"> You have already submitted an application for this job.</span>
                                </div>
                            ) : (
                                <form onSubmit={handleApply} className="max-w-md">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Resume/Portfolio Link (Google Drive, LinkedIn, etc.)
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            placeholder="https://..."
                                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            value={resumeLink}
                                            onChange={(e) => setResumeLink(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={applying}
                                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
                                    >
                                        {applying ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {user && user.role === 'admin' && (
                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <Link
                                to={`/admin/jobs/${job._id}/applicants`}
                                className="inline-block bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition"
                            >
                                View Applicants
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
