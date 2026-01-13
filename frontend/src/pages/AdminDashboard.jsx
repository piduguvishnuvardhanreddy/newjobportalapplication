import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs');
            setJobs(data.jobs); // Note: Current public API returns active jobs. Admin might need a separate endpoint for ALL jobs?
            // "Admin Capabilities: View list of all registered users... Create... Define details... View all applications"
            // "View all applications for each job" -> so list of jobs is needed. 
            // The public endpoint filters by deadline. Admin should see all? 
            // For now, using public endpoint.
        } catch (error) {
            console.error(error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await api.delete(`/jobs/${id}`);
                setJobs(jobs.filter(job => job._id !== id));
                toast.success('Job deleted successfully');
            } catch (error) {
                toast.error('Failed to delete job');
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading jobs...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <Link
                    to="/create-job"
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    <FaPlus className="mr-2" /> Post New Job
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length > 0 ? (
                    jobs.map(job => (
                        <JobCard
                            key={job._id}
                            job={job}
                            isAdmin={true}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">No jobs posted yet.</p>
                        <Link to="/create-job" className="text-indigo-600 hover:text-indigo-500 mt-2 inline-block">
                            Create your first job posting
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
