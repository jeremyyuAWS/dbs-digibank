import React, { useState } from 'react';
import { Video, Smartphone, FileText, Building2, Clock, Shield, CheckCircle } from 'lucide-react';
import kycModes from '../data/kyc-modes.json';

interface KYCSelectorProps {
  onKYCModeSelect: (mode: any) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  vcip: Video,
  'aadhaar-otp': Smartphone,
  'offline-xml': FileText,
  branch: Building2
};

export function KYCSelector({ onKYCModeSelect }: KYCSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<string>('');

  const handleModeSelect = (mode: any) => {
    setSelectedMode(mode.id);
    onKYCModeSelect(mode);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recommended': return 'bg-green-100 text-green-800 border-green-200';
      case 'Popular': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Privacy Focused': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Traditional': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="tour-kyc-choice space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Choose Your KYC Method</h2>
        <p className="text-gray-600">
          Select how you'd like to verify your identity. All methods are RBI-approved and secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kycModes.map((mode) => {
          const IconComponent = iconMap[mode.id];
          const isSelected = selectedMode === mode.id;
          
          return (
            <div
              key={mode.id}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleModeSelect(mode)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <IconComponent className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-black">{mode.name}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(mode.status)}`}>
                      {mode.status}
                    </span>
                  </div>
                </div>
                {isSelected && <CheckCircle className="h-6 w-6 text-green-600" />}
              </div>

              <p className="text-gray-600 mb-4">{mode.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Duration: {mode.duration}</span>
                  </div>
                  <span className="text-gray-500">{mode.availability}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {mode.features.map((feature: string, index: number) => (
                      <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Requirements:</p>
                  <div className="space-y-1">
                    {mode.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Shield className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Security & Compliance</h4>
              <p className="text-sm text-blue-800 mt-1">
                Your selected KYC method is fully RBI-compliant and uses bank-grade security. 
                All personal information is encrypted and stored securely according to Indian banking regulations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}