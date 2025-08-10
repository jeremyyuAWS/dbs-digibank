import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Edit, RefreshCw, Shield } from 'lucide-react';

interface CKYCPrefillProps {
  panNumber: string;
  onDataConfirmed: (data: any) => void;
  onBack: () => void;
}

interface CKYCData {
  name: string;
  dob: string;
  fatherName: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
  mobile: string;
  email: string;
  lastUpdated: string;
}

export function CKYCPrefill({ panNumber, onDataConfirmed, onBack }: CKYCPrefillProps) {
  const [loading, setLoading] = useState(false);
  const [ckycData, setCkycData] = useState<CKYCData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<CKYCData | null>(null);
  const [mismatches, setMismatches] = useState<string[]>([]);

  // Simulate CKYC data fetch
  const fetchCKYCData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock CKYC data based on PAN
    const mockData: CKYCData = {
      name: 'Rajesh Kumar Sharma',
      dob: '1985-06-15',
      fatherName: 'Suresh Kumar Sharma',
      address: {
        line1: 'Flat 203, Sunrise Apartment',
        line2: 'Sector 15, Dwarka',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110075'
      },
      mobile: '9876543210',
      email: 'rajesh.sharma@example.com',
      lastUpdated: '2023-11-15'
    };

    // Simulate potential data mismatches
    const potentialMismatches = [];
    if (Math.random() > 0.7) potentialMismatches.push('mobile');
    if (Math.random() > 0.8) potentialMismatches.push('email');
    
    setCkycData(mockData);
    setFormData(mockData);
    setMismatches(potentialMismatches);
    setLoading(false);
  };

  const handleFieldUpdate = (field: string, value: string) => {
    if (!formData) return;
    
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev!,
        address: {
          ...prev!.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev!,
        [field]: value
      }));
    }
  };

  const handleConfirm = () => {
    if (!formData) return;
    
    onDataConfirmed({
      ...formData,
      ckycFetched: true,
      panNumber,
      mismatches,
      dataSource: 'CKYC'
    });
  };

  if (!ckycData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">CKYC Data Prefill</h2>
          <p className="text-gray-600 mb-6">
            We'll fetch your existing KYC data from the Central KYC Registry to speed up your application.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">CKYC Benefits</h3>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Auto-fill personal details from verified sources</li>
                  <li>• Reduce manual data entry errors</li>
                  <li>• Speed up account opening process</li>
                  <li>• Use RBI-approved centralized KYC data</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">PAN Number</span>
              <span className="text-sm text-gray-900 font-mono">{panNumber}</span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Fetching your CKYC data...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={fetchCKYCData}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Fetch CKYC Data
              </button>
              
              <button
                onClick={() => onDataConfirmed({ ckycFetched: false, panNumber })}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Skip CKYC Prefill
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-black">CKYC Data Retrieved</h2>
            <p className="text-gray-600">Please verify and update your information if needed</p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit className="h-4 w-4" />
            {editMode ? 'View Mode' : 'Edit Mode'}
          </button>
        </div>
        
        {mismatches.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">Data Verification Required</h3>
                <p className="text-sm text-orange-800 mt-1">
                  Some information may need verification. Please review the highlighted fields.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black mb-4">Personal Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData?.name || ''}
                onChange={(e) => handleFieldUpdate('name', e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData?.dob || ''}
                onChange={(e) => handleFieldUpdate('dob', e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
              <input
                type="text"
                value={formData?.fatherName || ''}
                onChange={(e) => handleFieldUpdate('fatherName', e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
              />
            </div>
            
            <div className={`${mismatches.includes('mobile') ? 'bg-yellow-50 p-3 rounded-lg border border-yellow-200' : ''}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
                {mismatches.includes('mobile') && <span className="text-yellow-600 ml-1">(Please verify)</span>}
              </label>
              <input
                type="tel"
                value={formData?.mobile || ''}
                onChange={(e) => handleFieldUpdate('mobile', e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
              />
            </div>
            
            <div className={`${mismatches.includes('email') ? 'bg-yellow-50 p-3 rounded-lg border border-yellow-200' : ''}`}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
                {mismatches.includes('email') && <span className="text-yellow-600 ml-1">(Please verify)</span>}
              </label>
              <input
                type="email"
                value={formData?.email || ''}
                onChange={(e) => handleFieldUpdate('email', e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black mb-4">Address Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
              <input
                type="text"
                value={formData?.address.line1 || ''}
                onChange={(e) => handleFieldUpdate('address.line1', e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
              <input
                type="text"
                value={formData?.address.line2 || ''}
                onChange={(e) => handleFieldUpdate('address.line2', e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData?.address.city || ''}
                  onChange={(e) => handleFieldUpdate('address.city', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData?.address.state || ''}
                  onChange={(e) => handleFieldUpdate('address.state', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                value={formData?.address.pincode || ''}
                onChange={(e) => handleFieldUpdate('address.pincode', e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:bg-gray-50"
                maxLength={6}
              />
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Data Source</h4>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Central KYC Registry (CKYC)</span>
              </div>
              <p className="text-xs text-gray-500">Last updated: {formData?.lastUpdated}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleConfirm}
            className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Confirm Details & Continue
          </button>
        </div>
      </div>
    </div>
  );
}