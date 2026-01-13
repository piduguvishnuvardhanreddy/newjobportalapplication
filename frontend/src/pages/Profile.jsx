import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUserEdit, FaSave, FaTimes, FaBriefcase, FaEnvelope, FaUser } from 'react-icons/fa';

const Profile = () => {
    const { user, login } = useAuth(); // Assume updateProfile will be added or we manually call API
    // Actually best to add updateProfile to AuthContext, but let's see if we can just use API directly here for now or update context
    // Ideally context should update its local user state. I'll stick to local state for now and reload context.

    // Better: Add updateProfile to AuthContext. For now, I'll import API directly to call the endpoint
    // and then manually update local state or refresh.

    // WAIT: I should add updateProfile to AuthContext first to keep it clean.
    // I will do that in the next step. For now I'll scaffold this expecting `updateProfile` from context.
    // Actually, I'll use the API directly and then update the user in context if possible, or just re-fetch.

    // Let's implement the component assuming we pass `updateProfile` from context.

    // RE-READ context: user is just state. setUser is internal. 
    // I will add `updateUserProfile` to AuthContext in the next tool call.

    const { updateUserProfile } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        title: '',
        bio: '',
        skills: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                title: user.title || '',
                bio: user.bio || '',
                skills: user.skills ? user.skills.join(', ') : ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(formData);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    layout
                    className="bg-white shadow-xl rounded-2xl overflow-hidden"
                >
                    {/* Header / Banner */}
                    <div className="bg-indigo-600 h-32 md:h-48 relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-indigo-200 flex items-center justify-center text-indigo-600 text-5xl font-bold shadow-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 pb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-indigo-600 font-medium text-lg">{user?.title || 'No Title Set'}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                            >
                                {isEditing ? <FaTimes className="mr-2" /> : <FaUserEdit className="mr-2" />}
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.form
                                    key="edit"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div className="col-span-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="e.g. Senior Software Engineer"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div className="col-span-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                            <textarea
                                                name="bio"
                                                rows="4"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                placeholder="Tell us about yourself..."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                            />
                                        </div>
                                        <div className="col-span-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                                            <input
                                                type="text"
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                placeholder="React, Node.js, Design, etc."
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition transform hover:scale-105"
                                        >
                                            <FaSave className="mr-2" /> Save Changes
                                        </button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="view"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                                            <FaUser className="mr-2 text-indigo-500" /> About
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {user?.bio || "No bio added yet. Click edit to add a bio."}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                                            <FaBriefcase className="mr-2 text-indigo-500" /> Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user?.skills && user.skills.length > 0 ? (
                                                user.skills.map((skill, index) => (
                                                    <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 italic">No skills listed.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</h3>
                                        <div className="flex items-center text-gray-600">
                                            <FaEnvelope className="mr-2" /> {user?.email}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
