import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getJobs, getApplications } from '../utils/api';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          getJobs(),
          getApplications()
        ]);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const statusCount = (status) =>
    applications.filter((a) => a.status === status).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold"> AI Job Tracker</h1>
        <div className="flex gap-4 items-center">
          <Link to="/add-job" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
            + Add Job
          </Link>
          <Link to="/applications" className="hover:underline">
            Applications
          </Link>
          <span className="text-blue-200">Hi, {user?.username}!</span>
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Jobs', value: jobs.length, color: 'bg-blue-500' },
            { label: 'Applied', value: statusCount('Applied'), color: 'bg-yellow-500' },
            { label: 'Interviews', value: statusCount('Interview'), color: 'bg-purple-500' },
            { label: 'Offers', value: statusCount('Offer'), color: 'bg-green-500' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} text-white p-6 rounded-xl shadow`}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm mt-1 opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Jobs</h2>
            <Link to="/add-job" className="text-blue-600 hover:underline text-sm">
              + Add New Job
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">No jobs added yet!</p>
              <Link to="/add-job" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Add Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{job.role}</h3>
                      <p className="text-gray-500 text-sm">{job.company_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-medium text-sm">{job.salary_range}</p>
                      <p className="text-gray-400 text-xs">{job.location}</p>
                    </div>
                  </div>
                  {job.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.required_skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;