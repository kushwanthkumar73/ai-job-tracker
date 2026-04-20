import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplications, updateApplication, deleteApplication } from '../utils/api';

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

const STATUS_COLORS = {
  Applied: 'bg-yellow-100 border-yellow-400',
  Interview: 'bg-purple-100 border-purple-400',
  Offer: 'bg-green-100 border-green-400',
  Rejected: 'bg-red-100 border-red-400',
};

const STATUS_BADGE = {
  Applied: 'bg-yellow-500',
  Interview: 'bg-purple-500',
  Offer: 'bg-green-500',
  Rejected: 'bg-red-500',
};

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplication(id, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert('Error updating status!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      alert('Error deleting application!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🚀 AI Job Tracker</h1>
        <div className="flex gap-4">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/add-job" className="bg-white text-blue-600 px-4 py-1 rounded-lg font-medium hover:bg-gray-100">
            + Add Job
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Applications Kanban Board
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className={`rounded-xl border-t-4 ${STATUS_COLORS[status]} p-4`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-700">{status}</h3>
                  <span className={`${STATUS_BADGE[status]} text-white text-xs px-2 py-1 rounded-full`}>
                    {applications.filter((a) => a.status === status).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {applications
                    .filter((app) => app.status === status)
                    .map((app) => (
                      <div key={app.id} className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {app.job_details?.role}
                        </h4>
                        <p className="text-gray-500 text-xs mt-1">
                          {app.job_details?.company_name}
                        </p>

                        {app.match_score && (
                          <div className="mt-2">
                            <span className={`text-xs font-bold ${app.match_score >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                              Match: {app.match_score}%
                            </span>
                          </div>
                        )}

                        <p className="text-gray-400 text-xs mt-1">
                          {app.applied_date}
                        </p>

                        {/* Status Change */}
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="mt-2 w-full text-xs border border-gray-200 rounded p-1 focus:outline-none"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleDelete(app.id)}
                          className="mt-2 w-full text-xs text-red-500 hover:text-red-700"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ))}

                  {applications.filter((a) => a.status === status).length === 0 && (
                    <p className="text-gray-400 text-xs text-center py-4">
                      No applications
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;