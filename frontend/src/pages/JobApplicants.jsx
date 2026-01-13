import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaFileAlt, FaArrowLeft } from 'react-icons/fa';

const JobApplicants = () => {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get(`/applications/job/${id}`);
            setApplications(data.applications);
        } catch (error) {
            toast.error('Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [id]);

    const handleStatusUpdate = async (appId, newStatus, newNote) => {
        try {
            await api.put(`/applications/${appId}/status`, {
                status: newStatus,
                note: newNote
            });
            toast.success('Status updated');
            fetchApplications(); // Refresh list
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="text-center py-10">Loading applicants...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link to="/admin-dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Applicants</h1>

            <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Note</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.length > 0 ? (
                            applications.map((app) => (
                                <ApplicantRow key={app._id} app={app} onUpdate={handleStatusUpdate} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                    No applicants for this job yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ApplicantRow = ({ app, onUpdate }) => {
    const [status, setStatus] = useState(app.status);
    const [note, setNote] = useState(app.note || '');

    const handleSave = () => {
        onUpdate(app._id, status, note);
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500">
                        <FaUser />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{app.applicant.name}</div>
                        <div className="text-sm text-gray-500">{app.applicant.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(app.appliedAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 flex items-center">
                    <FaFileAlt className="mr-1" /> View Resume
                </a>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col space-y-2">
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add note (e.g. Interview Date)"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-1"
                    />
                    <button
                        onClick={handleSave}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700"
                    >
                        Update
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default JobApplicants;
