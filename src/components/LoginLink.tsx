import React, { useState } from 'react';
import { Phone, CheckCircle, Clock, FileText, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginLinkProps {
  userState: {
    phoneVerified: boolean;
    onboardingProgress: number;
    currentApplication: any;
  };
}

export function LoginLink({ userState }: LoginLinkProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock application status data
  const mockApplications = [
    {
      id: 'DBS123456',
      type: 'Savings Account',
      status: 'kyc_pending',
      statusText: 'KYC Verification Pending',
      submittedDate: '2024-01-10',
      nextStep: 'Complete Aadhaar OTP verification',
      progress: 75
    },
    {
      id: 'PL789012',
      type: 'Personal Loan',
      status: 'under_review',
      statusText: 'Under Review',
      submittedDate: '2024-01-09',
      nextStep: 'Document verification in progress',
      progress: 60
    }
  ];

  const handleSendOTP = async () => {
    setLoading(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVerified(true);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'under_review': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'kyc_pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'under_review': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'kyc_pending': return <FileText className="h-5 w-5 text-orange-600" />;
      case 'rejected': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  if (!verified && !userState.phoneVerified) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Check Application Status</h2>
          <p className="text-gray-600">
            Enter your registered mobile number to check the status of your applications
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            {!otpSent ? (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registered Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-black"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSendOTP}
                  disabled={phoneNumber.length !== 10 || loading}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                  <Phone className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <Phone className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2">OTP Sent</h3>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit OTP to +91 {phoneNumber}
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center text-lg tracking-wider"
                    maxLength={6}
                  />
                </div>
                
                <button
                  onClick={handleVerifyOTP}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                  <CheckCircle className="h-4 w-4" />
                </button>
                
                <p className="text-center mt-4">
                  <button 
                    onClick={() => setOtpSent(false)}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Change mobile number
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show application status after verification
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Your Applications</h2>
        <p className="text-gray-600">
          Track the status of your DBS applications and next steps
        </p>
      </div>

      <div className="space-y-4">
        {mockApplications.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                {getStatusIcon(app.status)}
                <div>
                  <h3 className="font-semibold text-lg text-black">{app.type}</h3>
                  <p className="text-sm text-gray-500">Application ID: {app.id}</p>
                  <p className="text-sm text-gray-500">Submitted: {new Date(app.submittedDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                {app.statusText}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-600">{app.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${app.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-sm mb-2">Next Step</h4>
              <p className="text-sm text-gray-600">{app.nextStep}</p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Continue Application
                <ArrowRight className="h-4 w-4" />
              </button>
              
              {app.type === 'Savings Account' && app.status === 'kyc_pending' && (
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Find Branch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="text-center">
          <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-sm text-blue-800 mb-4">
            Our customer service team is available 24/7 to assist you with your applications
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Call Support
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}