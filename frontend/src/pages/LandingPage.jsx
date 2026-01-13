import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaRocket, FaSearch, FaUserCheck, FaBuilding } from 'react-icons/fa';

const LandingPage = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/find-jobs" replace />;
    }

    const companies = [
        { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
        { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
        { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
        { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
        { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
        { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white pt-20 pb-32">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                            Find Your <span className="text-yellow-300">Dream Job</span> <br /> Today
                        </motion.h1>
                        <motion.p variants={itemVariants} className="mt-4 text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
                            Connect with thousands of top employers and discover opportunities that match your skills and ambitions.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex justify-center gap-4">
                            <Link to="/register" className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-full text-lg shadow-lg hover:bg-gray-100 transition transform hover:scale-105">
                                Get Started
                            </Link>
                            <Link to="/login" className="px-8 py-3 bg-indigo-500 bg-opacity-30 border-2 border-white text-white font-bold rounded-full text-lg hover:bg-opacity-50 transition transform hover:scale-105">
                                Login
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Company Carousel */}
            <section className="py-12 bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 font-medium mb-8 uppercase tracking-widest text-sm">Trusted by Industry Leaders</p>
                    {/* Infinite Carousel Animation */}
                    <div className="relative overflow-hidden group">
                        <motion.div
                            className="flex space-x-12 whitespace-nowrap"
                            animate={{ x: [0, -1000] }}
                            transition={{
                                repeat: Infinity,
                                duration: 25,
                                ease: "linear"
                            }}
                        >
                            {/* Duplicate strictly for infinite loop illusion */}
                            {[...companies, ...companies, ...companies].map((company, index) => (
                                <div key={index} className="inline-block flex items-center justify-center min-w-[150px] opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                                    <img src={company.logo} alt={company.name} className="h-10 object-contain" />
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose JobPortal?</h2>
                        <p className="mt-4 text-xl text-gray-500">Everything you need to find your next career move.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 bg-indigo-50 rounded-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <FaSearch />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Job Search</h3>
                            <p className="text-gray-600">Advanced filters to find the perfect role matching your skills and location.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 bg-purple-50 rounded-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <FaRocket />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Applications</h3>
                            <p className="text-gray-600">Apply to multiple jobs with a single profile and track your status.</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="p-8 bg-pink-50 rounded-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                <FaBuilding />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Top Companies</h3>
                            <p className="text-gray-600">Get access to exclusive listings from the world's most innovative teams.</p>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
