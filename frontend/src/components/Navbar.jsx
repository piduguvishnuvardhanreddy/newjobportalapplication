import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaUserCircle, FaBriefcase } from 'react-icons/fa';

import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
            className="bg-white shadow-md sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user ? "/find-jobs" : "/"} className="flex-shrink-0 flex items-center">
                            <motion.div whileHover={{ rotate: 15 }}>
                                <FaBriefcase className="h-8 w-8 text-indigo-600" />
                            </motion.div>
                            <span className="ml-2 text-xl font-bold text-gray-800">JobPortal</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {user.role === 'user' && (
                                    <Link to="/applied-jobs" className="text-gray-600 hover:text-indigo-600 transition">
                                        Applied Jobs
                                    </Link>
                                )}
                                {user.role === 'admin' && (
                                    <Link to="/admin-dashboard" className="text-gray-600 hover:text-indigo-600 transition">
                                        Dashboard
                                    </Link>
                                )}
                                <span className="text-gray-600 hidden md:block">Welcome, {user.name}</span>
                                <Link
                                    to="/profile"
                                    className="flex items-center text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out mr-4"
                                >
                                    <FaUserCircle className="mr-1 h-6 w-6" /> Profile
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out"
                                >
                                    <FaSignOutAlt className="mr-1" /> Logout
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Login
                                </Link>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        to="/register"
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm transition"
                                    >
                                        Register
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav >
    );
};

export default Navbar;
