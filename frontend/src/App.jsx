import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import JobFeed from './pages/JobFeed';
import AdminDashboard from './pages/AdminDashboard';
import CreateJob from './pages/CreateJob';

import JobApplicants from './pages/JobApplicants';

import JobDetails from './pages/JobDetails';
import AppliedJobs from './pages/AppliedJobs';

import LandingPage from './pages/LandingPage';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/jobs/:id" element={<JobDetails />} /> {/* Public view but Apply is protected */}

          {/* Protected User Routes */}
          <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
            <Route path="/find-jobs" element={<JobFeed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/applied-jobs" element={<AppliedJobs />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/create-job" element={<CreateJob />} />
            <Route path="/admin/jobs/:id/applicants" element={<JobApplicants />} />
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
