import React, { useState } from 'react';
import { Calculator, FileText, TrendingUp, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import loanProducts from '../data/loan-products.json';

interface PersonalLoanFormProps {
  onLoanApplication: (application: any) => void;
}

export function PersonalLoanForm({ onLoanApplication }: PersonalLoanFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    income: '',
    employment: '',
    tenure: '24'
  });
  
  const [eligibility, setEligibility] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const personalLoan = loanProducts.find(p => p.id === 'personal-loan')!;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEligibility = () => {
    const amount = parseInt(formData.amount);
    const income = parseInt(formData.income);
    const tenure = parseInt(formData.tenure);

    // Simple eligibility logic
    const maxEligible = income * 50; // 50x monthly income
    const eligible = amount <= maxEligible && income >= 25000;
    
    const interestRate = income >= 50000 ? 12.99 : income >= 35000 ? 15.99 : 18.99;
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
    setShowResults(true);
  };

  const handleApply = () => {
    onLoanApplication({
      ...formData,
      eligibility,
      applicationId: 'PL' + Date.now(),
      status: 'pending'
    });
  };

  return (
    <div className="tour-loan-section space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Personal Loan Application</h2>
        <p className="text-gray-600">
          Get instant eligibility assessment and competitive interest rates starting from {personalLoan.interestRange.split(' - ')[0]}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Loan Calculator
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount (₹50,000 - ₹40,00,000)"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter your monthly income"
                  value={formData.income}
                  onChange={(e) => handleInputChange('income', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={formData.employment}
                  onChange={(e) => handleInputChange('employment', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select employment type</option>
                  <option value="salaried">Salaried</option>
                  <option value="self-employed">Self Employed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Tenure
                </label>
                <select
                  value={formData.tenure}
                  onChange={(e) => handleInputChange('tenure', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Purpose
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select purpose</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="education">Education</option>
                  <option value="wedding">Wedding</option>
                  <option value="travel">Travel</option>
                  <option value="home-improvement">Home Improvement</option>
                  <option value="debt-consolidation">Debt Consolidation</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <button
                onClick={calculateEligibility}
                disabled={!formData.amount || !formData.income || !formData.employment}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                Check Eligibility
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {showResults && eligibility && (
            <div className="bg-white rounded-2xl p-6 shadow-md border">
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

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="text-2xl font-bold text-black">₹{eligibility.amount.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Interest Rate</p>
                    <p className="text-2xl font-bold text-green-600">{eligibility.interestRate}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Monthly EMI</p>
                    <p className="text-2xl font-bold text-blue-600">₹{eligibility.emi.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Processing Fee</p>
                    <p className="text-2xl font-bold text-gray-700">₹{eligibility.processingFee.toLocaleString()}</p>
                  </div>
                </div>

                {!eligibility.eligible && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-900">Eligibility Note</p>
                        <p className="text-sm text-orange-800">
                          Based on your income, you're eligible for up to ₹{eligibility.maxEligible.toLocaleString()}. 
                          Consider adjusting your loan amount or increasing your income documentation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleApply}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Apply for Loan
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-md border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Required Documents
            </h3>
            <div className="space-y-3">
              {personalLoan.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{doc}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 bg-blue-50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-900">Quick Processing</p>
                  <p className="text-xs text-blue-800">
                    With DigiLocker integration, we can fetch most documents automatically to speed up your application.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Loan Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Interest Rate Range</span>
                <span className="text-sm font-medium">{personalLoan.interestRange}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount Range</span>
                <span className="text-sm font-medium">
                  ₹{personalLoan.amountRange[0].toLocaleString()} - ₹{personalLoan.amountRange[1].toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tenure</span>
                <span className="text-sm font-medium">{personalLoan.tenure}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Processing Fee</span>
                <span className="text-sm font-medium">{personalLoan.processingFee}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}