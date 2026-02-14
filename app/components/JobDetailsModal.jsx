import { Fragment } from 'react';

export default function JobDetailsModal({ job, isOpen, onClose, onApply, session, hasApplied }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {job.title}
                </h2>
                <div className="flex items-center mt-2">
                  <span className="mr-2">🏢</span>
                  <span className="text-blue-100 font-medium">{job.company?.name}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-xl mr-3">📍</span>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-xl mr-3">💰</span>
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">{job.salary || "Competitive"}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-xl mr-3">💼</span>
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-medium">{job.type || "Full-time"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Job Description
              </h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info */}
            {job.company && (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🏢</span>
                  About {job.company.name}
                </h3>
                <p className="text-gray-700">{job.company.description || "A leading company in their industry."}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {session?.user?.role === "user" && (
                <button
                  onClick={onApply}
                  disabled={hasApplied}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    hasApplied
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <span className="mr-2">✓</span>
                      Already Applied
                    </>
                  ) : (
                    <>
                      <span className="mr-2">💼</span>
                      Apply for this Position
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}