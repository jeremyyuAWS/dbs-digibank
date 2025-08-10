import React, { useState } from 'react';
import { Building2, FileText, MapPin, User, CheckCircle, AlertCircle, ArrowRight, Shield, Clock, Camera } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Checkbox } from './ui/Checkbox';
import { VideoKYC } from './VideoKYC';
import { CKYCPrefill } from './CKYCPrefill';
import { OfflineAadhaarXML } from './OfflineAadhaarXML';

interface OnboardingFlowProps {
  onProgressUpdate: (progress: number, data?: any) => void;
  currentProgress: number;
}

export function OnboardingFlow({ onProgressUpdate, currentProgress }: OnboardingFlowProps) {
  const [step, setStep] = useState(currentProgress === 0 ? 0 : Math.floor(currentProgress / 20));
  const [formData, setFormData] = useState({
    permissions: {},
    pan: '',
    panSkipped: false,
    kycMode: '',
    aadhaar: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: ''
    },
    personal: {
      email: '',
      occupation: '',
      income: '',
      pep: false
    },
    selectedPlan: '',
    branchAppointment: null,
    ckycData: null,
    kycResult: null
  });
  
  const [showPermissions, setShowPermissions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCKYC, setShowCKYC] = useState(false);

  const permissions = [
    {
      id: 'camera',
      title: 'Camera & Photos',
      description: 'To capture documents for KYC verification',
      alternative: 'Upload PDF documents manually',
      icon: Camera
    },
    {
      id: 'location', 
      title: 'Location Access',
      description: 'To find nearest DBS branches and ATMs',
      alternative: 'Search by pincode manually',
      icon: MapPin
    }
  ];

  const kycModes = [
    {
      id: 'vcip',
      name: 'Video-KYC (V-CIP)',
      description: 'Complete KYC via video call with our agent',
      duration: '5-7 minutes',
      status: 'Recommended',
      features: ['Branchless', 'Instant approval', 'RBI approved']
    },
    {
      id: 'aadhaar-otp',
      name: 'Aadhaar OTP e-KYC',
      description: 'Instant verification using your Aadhaar',
      duration: '2-3 minutes',
      status: 'Popular',
      features: ['Instant', 'Digital', 'Secure']
    },
    {
      id: 'offline-xml',
      name: 'Aadhaar Offline XML',
      description: 'Privacy-preserving paperless e-KYC',
      duration: '3-4 minutes',
      status: 'Privacy Focused',
      features: ['No online Aadhaar sharing', 'Secure']
    },
    {
      id: 'branch',
      name: 'Visit DBS Branch', 
      description: 'Complete KYC at nearest branch',
      duration: '30-45 minutes',
      status: 'Traditional',
      features: ['Face-to-face', 'Physical documents']
    }
  ];

  const accountPlans = [
    {
      id: 'basic',
      name: 'Digital Savings Account',
      description: 'Perfect for everyday banking',
      minBalance: 0,
      features: ['Zero minimum balance', 'Free debit card', 'Mobile banking']
    },
    {
      id: 'classic', 
      name: 'Classic Savings Account',
      description: 'Enhanced banking benefits',
      minBalance: 10000,
      features: ['Higher interest rates', 'Priority service', 'Premium card']
    },
    {
      id: 'premium',
      name: 'Premium Savings Account', 
      description: 'Exclusive wealth management',
      minBalance: 100000,
      features: ['Relationship manager', 'Investment advisory', 'Lounge access']
    }
  ];

  const handleNext = async (stepData?: any) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (stepData) {
      setFormData(prev => ({ ...prev, ...stepData }));
    }
    
    const nextStep = step + 1;
    setStep(nextStep);
    onProgressUpdate(nextStep * 20, { ...formData, ...stepData });
    setLoading(false);
  };

  const handlePermissionsSet = (permissions: Record<string, boolean>) => {
    setShowPermissions(false);
    handleNext({ permissions });
  };

  const simulateError = () => {
    return Math.random() > 0.8; // 20% chance of error for demo
  };

  // Screen 01 - Start Onboarding
  if (step === 0) {
    return (
      <div className="text-center py-12">
        <Dialog open={showPermissions} onOpenChange={setShowPermissions}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>App Permissions</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Your privacy matters.</strong> All permissions are optional with manual alternatives available.
                </p>
              </div>
              
              {permissions.map((perm) => (
                <div key={perm.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id={perm.id}
                      onCheckedChange={(checked) => {
                        setFormData(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions, [perm.id]: checked }
                        }));
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <perm.icon className="h-4 w-4 text-gray-600" />
                        <h3 className="font-medium">{perm.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{perm.description}</p>
                      <p className="text-xs text-green-600">Alternative: {perm.alternative}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => handlePermissionsSet(formData.permissions)}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Continue
              </button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="max-w-2xl mx-auto">
          <img 
            src="/DBS-bank-logo.jpeg" 
            alt="DBS Bank"
            className="h-16 w-auto mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold text-black mb-4">Open Your Savings Account</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Complete account opening in minutes with our RBI-compliant digital onboarding process
          </p>
          
          <button
            onClick={() => setShowPermissions(true)}
            className="px-8 py-4 bg-black text-white rounded-2xl text-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Start Account Opening'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Screen 05 - PAN Entry
  if (step === 1) {
    // Show CKYC prefill after PAN entry
    if (showCKYC && formData.pan && !formData.panSkipped) {
      return (
        <CKYCPrefill
          panNumber={formData.pan}
          onDataConfirmed={(data) => {
            setFormData(prev => ({ ...prev, ckycData: data }));
            setShowCKYC(false);
            handleNext({ pan: formData.pan, ckycData: data });
          }}
          onBack={() => setShowCKYC(false)}
        />
      );
    }

    return (
      <div className="tour-pan-entry max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">PAN Verification</h2>
          <p className="text-gray-600 mb-6">
            We need your PAN for KYC compliance. You can skip this step and provide it later at the branch.
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!formData.pan && !formData.panSkipped) return;
            
            if (formData.pan) {
              if (simulateError()) {
                alert('PAN verification failed. Please check your PAN number or skip for now.');
                return;
              }
              // Show CKYC prefill option after successful PAN verification
              setShowCKYC(true);
            } else {
              handleNext({ pan: formData.pan, panSkipped: formData.panSkipped });
            }
          }}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={formData.pan}
                onChange={(e) => setFormData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                disabled={formData.panSkipped}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                maxLength={10}
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="skip-pan"
                  checked={formData.panSkipped}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      panSkipped: checked as boolean,
                      pan: checked ? '' : prev.pan
                    }));
                  }}
                />
                <label htmlFor="skip-pan" className="text-sm text-gray-600">
                  Skip for now (You can provide PAN at branch KYC)
                </label>
              </div>
            </div>
            
            {formData.panSkipped && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Limited Account</p>
                    <p className="text-sm text-yellow-800">
                      Without PAN, your account will have transaction limits until Full KYC is completed at branch.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              disabled={loading || (!formData.pan && !formData.panSkipped)}
            >
              {loading ? 'Verifying...' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Screen 06 - KYC Mode Selector
  if (step === 2) {
    return (
      <div className="tour-kyc-choice space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Choose Your KYC Method</h2>
          <p className="text-gray-600">
            Select how you'd like to verify your identity. All methods are RBI-approved and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {kycModes.map((mode) => (
            <div
              key={mode.id}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md ${
                formData.kycMode === mode.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, kycMode: mode.id }))}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-black">{mode.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
                    mode.status === 'Recommended' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}>
                    {mode.status}
                  </span>
                </div>
                {formData.kycMode === mode.id && <CheckCircle className="h-6 w-6 text-green-600" />}
              </div>

              <p className="text-gray-600 mb-4">{mode.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Duration: {mode.duration}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {mode.features.map((feature: string, index: number) => (
                    <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {formData.kycMode && (
          <div className="text-center">
            <button
              onClick={() => handleNext({ kycMode: formData.kycMode })}
              className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Continue with ' + kycModes.find(m => m.id === formData.kycMode)?.name}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Screen 07 - KYC Process (Aadhaar or Branch)
  if (step === 3) {
    if (formData.kycMode === 'vcip') {
      return (
        <VideoKYC
          onComplete={(result) => {
            if (result.success) {
              setFormData(prev => ({ ...prev, kycResult: result }));
              handleNext({ kycResult: result });
            } else {
              // Handle failure - could offer to switch to different KYC method
              if (confirm('Video-KYC session ended. Would you like to try a different KYC method?')) {
                setStep(2); // Go back to KYC selector
              }
            }
          }}
          onBack={() => setStep(2)}
        />
      );
    }
    
    if (formData.kycMode === 'offline-xml') {
      return (
        <OfflineAadhaarXML
          onComplete={(result) => {
            if (result.success) {
              setFormData(prev => ({ 
                ...prev, 
                kycResult: result,
                // Prefill address from XML data
                address: result.data.address
              }));
              handleNext({ kycResult: result, address: result.data.address });
            }
          }}
          onBack={() => setStep(2)}
        />
      );
    }
    
    if (formData.kycMode === 'aadhaar-otp') {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-black mb-4">Aadhaar e-KYC</h2>
            <p className="text-gray-600 mb-6">
              Enter your Aadhaar number to receive OTP for instant verification
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!formData.aadhaar) return;
              
              if (simulateError()) {
                if (confirm('Aadhaar verification failed. Would you like to switch to branch KYC?')) {
                  setFormData(prev => ({ ...prev, kycMode: 'branch' }));
                  return;
                } else {
                  return;
                }
              }
              
              // Simulate address prefill from Aadhaar
              const mockAddress = {
                line1: 'House No 123, Sample Street',
                line2: 'Near City Center',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400001'
              };
              
              handleNext({ aadhaar: formData.aadhaar, address: mockAddress });
            }}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  placeholder="Enter 12-digit Aadhaar number"
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
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Your Privacy is Protected</p>
                    <p className="text-sm text-blue-800">
                      Your Aadhaar number is encrypted and will be masked after verification. We only store the last 4 digits.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                disabled={loading || formData.aadhaar.length !== 12}
              >
                {loading ? 'Verifying...' : 'Send OTP'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      );
    } else {
      // Branch KYC booking
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-black mb-4">Book Branch Appointment</h2>
            <p className="text-gray-600 mb-6">
              Schedule your KYC appointment at the nearest DBS branch
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-medium">DBS Bank - Bandra Kurla Complex</h3>
                <p className="text-sm text-gray-600">Ground Floor, Plot No C-6, G Block, Bandra Kurla Complex</p>
                <p className="text-sm text-gray-600">Distance: 2.3 km</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date & Time
                </label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Tomorrow, 10:00 AM</option>
                  <option>Tomorrow, 2:00 PM</option>
                  <option>Day after tomorrow, 11:00 AM</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={() => {
                const confirmationId = 'BR' + Date.now();
                handleNext({ 
                  branchAppointment: {
                    branchId: 'BKC001',
                    date: 'Tomorrow',
                    time: '10:00 AM',
                    confirmationId
                  }
                });
              }}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
              <CheckCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    }
  }

  // Screen 08 - Address Confirmation (only for Aadhaar)
  if (step === 4 && (formData.kycMode === 'aadhaar-otp' || formData.kycMode === 'offline-xml')) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">Confirm Your Address</h2>
          <p className="text-gray-600 mb-6">
            {formData.kycMode === 'offline-xml' 
              ? "We've extracted your address from the Aadhaar XML file. Please confirm or make minor edits."
              : "We've prefilled your address from Aadhaar. Please confirm or make minor edits."
            }
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            handleNext({ address: formData.address });
          }}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.address.line1}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line1: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.address.line2}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line2: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, pincode: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Confirming...' : 'Confirm Address'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Screen 09 - Personal Details (only for Aadhaar flow)
  const personalDetailsStep = (step === 4 && (formData.kycMode === 'branch' || formData.kycMode === 'vcip')) || 
                             (step === 5 && (formData.kycMode === 'aadhaar-otp' || formData.kycMode === 'offline-xml'));
  
  if (personalDetailsStep) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">Personal Details</h2>
          <p className="text-gray-600 mb-6">
            Please provide some additional details to complete your profile
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const nextStepNum = (formData.kycMode === 'branch' || formData.kycMode === 'vcip') ? 5 : 6;
            setStep(nextStepNum);
            onProgressUpdate(nextStepNum * 20, { ...formData, personal: formData.personal });
          }}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.personal.email}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    personal: { ...prev.personal, email: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <select
                  value={formData.personal.occupation}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    personal: { ...prev.personal, occupation: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select occupation</option>
                  <option value="salaried">Salaried Professional</option>
                  <option value="business">Business Owner</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income Range
                </label>
                <select
                  value={formData.personal.income}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    personal: { ...prev.personal, income: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                >
                  <option value="">Select income range</option>
                  <option value="0-25000">Up to ₹25,000</option>
                  <option value="25000-50000">₹25,000 - ₹50,000</option>
                  <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                  <option value="100000+">Above ₹1,00,000</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="pep"
                  checked={formData.personal.pep}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    personal: { ...prev.personal, pep: checked as boolean }
                  }))}
                />
                <label htmlFor="pep" className="text-sm text-gray-700">
                  I am a Politically Exposed Person (PEP) or related to one
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Screen 10 - Plan Selection
  const planStep = (formData.kycMode === 'branch' || formData.kycMode === 'vcip') ? 5 : 6;
  if (step === planStep) {
    return (
      <div className="tour-account-types space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Choose Your Account Plan</h2>
          <p className="text-gray-600">
            Select the savings account that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {accountPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md ${
                formData.selectedPlan === plan.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setFormData(prev => ({ ...prev, selectedPlan: plan.id }))}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-xl text-black">{plan.name}</h3>
                {formData.selectedPlan === plan.id && <CheckCircle className="h-6 w-6 text-green-600" />}
              </div>

              <p className="text-gray-600 mb-4">{plan.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Minimum Balance</span>
                  <span className="font-medium">
                    {plan.minBalance === 0 ? 'Zero Balance' : `₹${plan.minBalance.toLocaleString()}`}
                  </span>
                </div>

                <div className="space-y-1">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {formData.selectedPlan && (
          <div className="bg-white rounded-2xl p-6 shadow-md max-w-2xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Terms & Conditions</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 max-h-32 overflow-y-auto">
                <p>By opening this account, you agree to:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>DBS Bank terms and conditions for savings accounts</li>
                  <li>Interest rates as per current bank policy</li>
                  <li>Charges as applicable and notified from time to time</li>
                  <li>KYC compliance requirements as per RBI guidelines</li>
                </ul>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData(prev => ({ 
                    ...prev, 
                    termsAccepted: checked as boolean 
                  }))}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the terms and conditions
                </label>
              </div>
              
              <button
                onClick={() => {
                  const nextStepNum = planStep + 1;
                  setStep(nextStepNum);
                  onProgressUpdate(100, formData); // Complete
                }}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                disabled={loading || !formData.termsAccepted}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
                <CheckCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Screen 12 - Confirmation
  const confirmationStep = planStep + 1;
  if (step === confirmationStep) {
    const applicationId = 'DBS' + Date.now().toString().slice(-6);
    
    return (
      <div className="text-center py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-black mb-4">Application Submitted Successfully!</h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Application ID</p>
            <p className="text-lg font-bold text-black">{applicationId}</p>
          </div>
          
          {formData.kycMode === 'aadhaar-otp' ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Your account is under review. You'll receive confirmation within 24 hours.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Download DBS digibank app</li>
                  <li>• Check SMS for account details</li>
                  <li>• Account activation within 24 hours</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Your KYC appointment is confirmed. Please visit the branch with required documents.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Appointment Details</h3>
                <p className="text-sm text-green-800">
                  <strong>Branch:</strong> DBS Bank - Bandra Kurla Complex<br />
                  <strong>Date & Time:</strong> Tomorrow, 10:00 AM<br />
                  <strong>Confirmation ID:</strong> {formData.branchAppointment?.confirmationId}
                </p>
              </div>
            ) : formData.kycMode === 'vcip' ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Your Video-KYC has been completed successfully. Your account is now being processed.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2">Video-KYC Details</h3>
                  <p className="text-sm text-green-800">
                    <strong>Session ID:</strong> {formData.kycResult?.sessionId}<br />
                    <strong>Agent:</strong> Priya Sharma (KYC Specialist)<br />
                    <strong>Completion:</strong> {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            ) : formData.kycMode === 'offline-xml' ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Your Offline Aadhaar XML has been processed successfully. Your account is under review.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">XML Verification Details</h3>
                  <p className="text-sm text-purple-800">
                    <strong>Method:</strong> Privacy-preserving e-KYC<br />
                    <strong>File:</strong> {formData.kycResult?.xmlFileName}<br />
                    <strong>Verified:</strong> {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => {
                setStep(0);
                setFormData({
                  permissions: {},
                  pan: '',
                  panSkipped: false,
                  kycMode: '',
                  aadhaar: '',
                  address: { line1: '', line2: '', city: '', state: '', pincode: '' },
                  personal: { email: '', occupation: '', income: '', pep: false },
                  selectedPlan: '',
                  termsAccepted: false
                });
                onProgressUpdate(0);
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Start New Application
            </button>
            
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Download App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}