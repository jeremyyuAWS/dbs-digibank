import React, { useState, useRef } from 'react';
import { Upload, FileText, Shield, ExternalLink, CheckCircle, AlertCircle, Download, Eye } from 'lucide-react';

interface OfflineAadhaarXMLProps {
  onComplete: (result: any) => void;
  onBack: () => void;
}

export function OfflineAadhaarXML({ onComplete, onBack }: OfflineAadhaarXMLProps) {
  const [step, setStep] = useState(0);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [shareCode, setShareCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.xml')) {
      setXmlFile(file);
    } else {
      alert('Please select a valid XML file');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.xml')) {
      setXmlFile(file);
    } else {
      alert('Please drop a valid XML file');
    }
  };

  const processXMLFile = async () => {
    if (!xmlFile || !shareCode) return;
    
    setLoading(true);
    
    // Simulate XML parsing and verification
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock extracted data
    const mockData = {
      name: 'Priya Mehta',
      dob: '1990-03-22',
      gender: 'F',
      address: {
        line1: 'House No 45, Green Valley',
        line2: 'Sector 18, Gurgaon',
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122015'
      },
      aadhaarNumber: 'XXXX XXXX 7890',
      photo: true,
      verified: true,
      timestamp: new Date().toISOString()
    };
    
    setExtractedData(mockData);
    setLoading(false);
    setStep(2);
  };

  // Step 0: Introduction and guide
  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">Offline Aadhaar XML e-KYC</h2>
          <p className="text-gray-600 mb-6">
            Complete your KYC using Offline Aadhaar XML - the most privacy-preserving e-KYC method approved by UIDAI.
          </p>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900">Privacy Benefits</h3>
                  <ul className="text-sm text-green-800 mt-2 space-y-1">
                    <li>• No online sharing of Aadhaar number</li>
                    <li>• You control what data is shared</li>
                    <li>• Encrypted and secure verification</li>
                    <li>• UIDAI approved offline method</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-3">How it works:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  <span className="text-sm text-blue-800">Generate XML file from UIDAI resident portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  <span className="text-sm text-blue-800">Upload XML file with share code</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  <span className="text-sm text-blue-800">Verify and complete KYC instantly</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setStep(1)}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Start XML Upload
              </button>
              
              <a
                href="https://resident.uidai.gov.in/offline-kyc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-100 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Generate XML on UIDAI Portal
              </a>
              
              <button
                onClick={onBack}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Choose Different KYC Method
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: File upload and share code
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">Upload Aadhaar XML File</h2>
          <p className="text-gray-600 mb-6">
            Please upload your offline Aadhaar XML file and enter the share code.
          </p>
          
          <div className="space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Aadhaar XML File
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  xmlFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {xmlFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <p className="font-medium text-green-900">{xmlFile.name}</p>
                    <p className="text-sm text-green-700">File size: {(xmlFile.size / 1024).toFixed(1)} KB</p>
                    <button
                      onClick={() => {
                        setXmlFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600 mb-2">Drag and drop your XML file here, or</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Browse Files
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Supports .xml files only</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xml"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {/* Share Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Code (4 digits)
              </label>
              <input
                type="text"
                placeholder="Enter 4-digit share code"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-center text-lg tracking-wider"
                maxLength={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 4-digit share code you used while generating the XML file
              </p>
            </div>
            
            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Security Notice</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Your XML file and share code are processed securely and deleted immediately after verification. 
                    We only extract the minimal required information for KYC compliance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(0)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={processXMLFile}
                disabled={!xmlFile || shareCode.length !== 4 || loading}
                className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing XML...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Verify & Process
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Data verification and confirmation
  if (step === 2 && extractedData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">Verify Extracted Data</h2>
          <p className="text-gray-600 mb-6">
            Please verify the information extracted from your Aadhaar XML file.
          </p>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">XML Verification Successful</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-700">File:</span>
                  <span className="ml-2 text-green-800 font-mono">{xmlFile?.name}</span>
                </div>
                <div>
                  <span className="text-green-700">Verified:</span>
                  <span className="ml-2 text-green-800">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-black">Personal Information</h3>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-black font-medium">{extractedData.name}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="text-black font-medium">{new Date(extractedData.dob).toLocaleDateString()}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <p className="text-black font-medium">{extractedData.gender === 'M' ? 'Male' : 'Female'}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm font-medium text-gray-700">Aadhaar Number</label>
                  <p className="text-black font-medium font-mono">{extractedData.aadhaarNumber}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-black">Address Information</h3>
                
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Complete Address</label>
                  <div className="text-black">
                    <p>{extractedData.address.line1}</p>
                    <p>{extractedData.address.line2}</p>
                    <p>{extractedData.address.city}, {extractedData.address.state}</p>
                    <p>{extractedData.address.pincode}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Photo Available</span>
                  </div>
                  <p className="text-xs text-blue-800">Photo extracted from XML for verification</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Verification Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>Method: Offline Aadhaar XML</div>
                <div>Status: Verified Successfully</div>
                <div>Timestamp: {new Date(extractedData.timestamp).toLocaleString()}</div>
                <div>Source: UIDAI Resident Portal</div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Upload Different File
              </button>
              
              <button
                onClick={() => onComplete({ 
                  success: true, 
                  method: 'offline-xml',
                  data: extractedData,
                  xmlFileName: xmlFile?.name 
                })}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}