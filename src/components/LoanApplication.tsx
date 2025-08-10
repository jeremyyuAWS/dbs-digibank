import React, { useState } from 'react';
import { Calculator, FileText, TrendingUp, AlertCircle, CheckCircle, Clock, User, ArrowRight } from 'lucide-react';

export function LoanApplication() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    pan: '',
    aadhaar: '',
    employment: '',
    income: '',
    amount: '',
    purpose: '',
    tenure: '24'
  });
  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateEligibility = () => {
    const amount = parseInt(formData.amount);
    const income = parseInt(formData.income);
    const tenure = parseInt(formData.tenure);

    // Simple eligibility logic
    const maxEligible = income * 50; // 50x monthly income
    const eligible = amount <= maxEligible && income >= 25000;
    
    const interestRate = income >= 50000 ? 10.99 : income >= 35000 ? 13.99 : 16.99;
    const emi = (amount * (interestRate / 1200) * Math.pow(1 + interestRate / 1200, tenure)) / 
                (Math.pow(1 + interestRate / 1200, tenure) - 1);

    setEligibility({
      eligible,
      amount: eligible ? amount : Math.min(amount, maxEligible),
      interestRate,
      tenure,
      emi: Math.round(emi),
      processingFee: Math.round(amount * 0.02),
      maxEligible
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep(2); // Go to confirmation
    setLoading(false);
  };

  // Step 0: Loan Preview
  if (step === 0) {
    return (
      <div className="tour-loan-section space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Personal Loan Application</h2>
          <p className="text-gray-600">
            Get instant pre-approval with competitive interest rates starting from 10.99% p.a.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Instant Eligibility Check</h3>
                <p className="text-gray-600 text-sm">Know your loan amount in minutes</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Loan Amount</p>
                <p className="text-xl font-bold text-black">₹50K - ₹40L</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="text-xl font-bold text-green-600">10.99%* p.a.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Tenure</p>
                <p className="text-xl font-bold text-black">12-60 months</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-xl font-bold text-black">24-48 hours</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Required Documents</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">KYC documents (PAN, Aadhaar)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Income proof (Salary slips/ITR)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Bank statements (3 months)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Start Application
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Application Form
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Loan Application</h2>
          <p className="text-gray-600">
            Please provide the following details for eligibility assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Personal Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={formData.pan}
                    onChange={(e) => setFormData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 12-digit Aadhaar"
                    value={formData.aadhaar}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData(prev => ({ ...prev, aadhaar: value }));
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    maxLength={12}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={formData.employment}
                    onChange={(e) => setFormData(prev => ({ ...prev, employment: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">Select employment type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter monthly income"
                    value={formData.income}
                    onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">Loan Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter desired loan amount"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    min="50000"
                    max="4000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Purpose
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">Select purpose</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="education">Education</option>
                    <option value="wedding">Wedding</option>
                    <option value="travel">Travel</option>
                    <option value="home-improvement">Home Improvement</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Tenure
                  </label>
                  <select
                    value={formData.tenure}
                    onChange={(e) => setFormData(prev => ({ ...prev, tenure: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>

                <button
                  onClick={calculateEligibility}
                  disabled={!formData.amount || !formData.income || !formData.employment || !formData.pan || !formData.aadhaar}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Check Eligibility
                </button>
              </div>
            </div>

            {eligibility && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  {eligibility.eligible ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  )}
                  <h3 className="text-xl font-semibold">
                    {eligibility.eligible ? 'Congratulations! You\'re Eligible' : 'Partial Eligibility'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Approved Amount</p>
                    <p className="text-xl font-bold text-black">₹{eligibility.amount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Interest Rate</p>
                    <p className="text-xl font-bold text-green-600">{eligibility.interestRate}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Monthly EMI</p>
                    <p className="text-xl font-bold text-blue-600">₹{eligibility.emi.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Processing Fee</p>
                    <p className="text-xl font-bold text-gray-700">₹{eligibility.processingFee.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Submit Loan Application
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Confirmation
  if (step === 2) {
    const applicationId = 'PL' + Date.now().toString().slice(-6);
    
    return (
      <div className="text-center py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-black mb-4">Loan Application Submitted!</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Application Reference</p>
            <p className="text-lg font-bold text-black">{applicationId}</p>
          </div>
          
          <p className="text-gray-600 mb-6">
            We've received your personal loan application. Our team will review it and get back to you within 24-48 hours.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
              <li>• Document verification and income assessment</li>
              <li>• Credit bureau check and risk evaluation</li>
              <li>• Final approval and loan disbursal process</li>
              <li>• SMS and email updates on application status</li>
            </ul>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setStep(0);
                setFormData({
                  pan: '', aadhaar: '', employment: '', income: '',
                  amount: '', purpose: '', tenure: '24'
                });
                setEligibility(null);
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              New Application
            </button>
            
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Track Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}