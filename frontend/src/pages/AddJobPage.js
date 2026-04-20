import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createJob, parseJD, matchResume, generateCoverLetter, createApplication } from '../utils/api';

const AddJobPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [jobData, setJobData] = useState({
    company_name: '',
    role: '',
    job_description: '',
    salary_range: '',
    location: '',
    required_skills: [],
  });

  const [resumeText, setResumeText] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [, setSavedJob] = useState(null);

  const handleParseJD = async () => {
    if (!jobData.job_description) return alert('Job description enter cheyyi!');
    setLoading(true);
    try {
      const res = await parseJD({ job_description: jobData.job_description });
      const data = res.data.data;
      setJobData((prev) => ({
        ...prev,
        company_name: prev.company_name || data.company,
        role: prev.role || data.role,
        salary_range: prev.salary_range || data.salary,
        required_skills: data.skills,
      }));
      alert('AI successfully parsed the JD!');
    } catch (err) {
      alert('Error parsing JD!');
    }
    setLoading(false);
  };

  const handleSaveJob = async () => {
    setLoading(true);
    try {
      const res = await createJob(jobData);
      setSavedJob(res.data);
      await createApplication({ job: res.data.id, status: 'Applied' });
      setStep(2);
    } catch (err) {
      alert('Error saving job!');
    }
    setLoading(false);
  };

  const handleMatchResume = async () => {
    if (!resumeText) return alert('Resume text enter cheyyi!');
    setLoading(true);
    try {
      const res = await matchResume({
        job_description: jobData.job_description,
        resume_text: resumeText,
      });
      setMatchResult(res.data.data);
      setStep(3);
    } catch (err) {
      alert('Error matching resume!');
    }
    setLoading(false);
  };

  const handleGenerateCoverLetter = async () => {
    setLoading(true);
    try {
      const res = await generateCoverLetter({
        job_description: jobData.job_description,
        resume_text: resumeText,
        company_name: jobData.company_name,
        role: jobData.role,
      });
      setCoverLetter(res.data.cover_letter);
    } catch (err) {
      alert('Error generating cover letter!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🚀 AI Job Tracker</h1>
        <Link to="/dashboard" className="hover:underline">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center mb-8">
          {['Job Details', 'Resume Match', 'Cover Letter'].map((s, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-2 ${step === i + 1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${step === i + 1 ? 'bg-blue-600' : step > i + 1 ? 'bg-green-500' : 'bg-gray-300'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className="hidden md:block">{s}</span>
              </div>
              {i < 2 && <div className="flex-1 h-1 mx-2 bg-gray-300" />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Step 1: Job Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Job Description</label>
              <textarea
                rows={6}
                value={jobData.job_description}
                onChange={(e) => setJobData({ ...jobData, job_description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                placeholder="Paste job description here..."
              />
              <button
                onClick={handleParseJD}
                disabled={loading}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                {loading ? 'Parsing...' : '🤖 Parse with AI'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                <input type="text" value={jobData.company_name}
                  onChange={(e) => setJobData({ ...jobData, company_name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  placeholder="Google" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Role</label>
                <input type="text" value={jobData.role}
                  onChange={(e) => setJobData({ ...jobData, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  placeholder="React Developer" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Salary Range</label>
                <input type="text" value={jobData.salary_range}
                  onChange={(e) => setJobData({ ...jobData, salary_range: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  placeholder="8-12 LPA" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <input type="text" value={jobData.location}
                  onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  placeholder="Hyderabad" />
              </div>
            </div>
            {jobData.required_skills.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Required Skills (AI Extracted)</label>
                <div className="flex flex-wrap gap-2">
                  {jobData.required_skills.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            <button onClick={handleSaveJob} disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save Job & Continue →'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Step 2: Resume Match</h2>
            <p className="text-gray-500 mb-4">Paste your resume text — AI will calculate match score!</p>
            <textarea rows={8} value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 mb-4"
              placeholder="Paste your resume text here..." />
            <button onClick={handleMatchResume} disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700">
              {loading ? 'Analyzing...' : '🤖 Check Match Score'}
            </button>
          </div>
        )}

        {step === 3 && matchResult && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Match Score Result</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-5xl font-bold ${matchResult.match_score >= 70 ? 'text-green-500' : matchResult.match_score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {matchResult.match_score}%
                </div>
                <p className="text-gray-600">{matchResult.recommendation}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-green-600 mb-2">✅ Matching Skills</h3>
                  {matchResult.matching_skills.map((s, i) => (
                    <span key={i} className="inline-block bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs mr-1 mb-1">{s}</span>
                  ))}
                </div>
                <div>
                  <h3 className="font-medium text-red-600 mb-2">❌ Missing Skills</h3>
                  {matchResult.missing_skills.length === 0 ? (
                    <p className="text-gray-400 text-sm">None! Perfect match!</p>
                  ) : matchResult.missing_skills.map((s, i) => (
                    <span key={i} className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs mr-1 mb-1">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Cover Letter</h2>
              {!coverLetter ? (
                <button onClick={handleGenerateCoverLetter} disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700">
                  {loading ? 'Generating...' : '🤖 Generate Cover Letter'}
                </button>
              ) : (
                <div>
                  <textarea rows={10} value={coverLetter} readOnly
                    className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-700 text-sm" />
                  <button onClick={() => navigator.clipboard.writeText(coverLetter)}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    📋 Copy Cover Letter
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => navigate('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
               Done — Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddJobPage;