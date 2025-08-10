import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, CheckCircle, AlertCircle, Camera, Clock, Shield, User } from 'lucide-react';

interface VideoKYCProps {
  onComplete: (result: any) => void;
  onBack: () => void;
}

export function VideoKYC({ onComplete, onBack }: VideoKYCProps) {
  const [step, setStep] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [agentConnected, setAgentConnected] = useState(false);
  const [kycSteps, setKycSteps] = useState({
    documentCheck: false,
    livenessCheck: false,
    addressVerification: false,
    finalApproval: false
  });
  const [loading, setLoading] = useState(false);

  // Simulate agent connection
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setAgentConnected(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Simulate KYC process steps
  const simulateKYCStep = (stepName: keyof typeof kycSteps) => {
    setLoading(true);
    setTimeout(() => {
      setKycSteps(prev => ({ ...prev, [stepName]: true }));
      setLoading(false);
    }, 2000);
  };

  // Step 0: Pre-call setup and document preparation
  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">Video-KYC Setup</h2>
          <p className="text-gray-600 mb-6">
            Prepare for your video call with our KYC specialist. The process takes 5-7 minutes.
          </p>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What you'll need:</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Original PAN Card (physical or digital)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Original Aadhaar Card (physical or digital)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Good lighting and stable internet
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  A quiet environment for the call
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Process Overview:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  Document verification
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  Liveness detection
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  Address confirmation
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  Final approval
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setStep(1)}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Video className="h-4 w-4" />
              Start Video-KYC
            </button>
            
            <button
              onClick={onBack}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Choose Different KYC Method
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Camera and microphone test
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-black mb-4">Camera & Microphone Test</h2>
          <p className="text-gray-600 mb-6">
            Please ensure your camera and microphone are working properly before we connect you with an agent.
          </p>
          
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
              {isVideoOn ? (
                <div className="text-white text-center">
                  <Camera className="h-12 w-12 mx-auto mb-2" />
                  <p>Camera Preview Active</p>
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs">
                    ● LIVE
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center">
                  <VideoOff className="h-12 w-12 mx-auto mb-2" />
                  <p>Camera Off</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-200' : 'bg-red-100'}`}
              >
                {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6 text-red-600" />}
              </button>
              
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3 rounded-full ${isAudioOn ? 'bg-gray-200' : 'bg-red-100'}`}
              >
                {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6 text-red-600" />}
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Camera access granted</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Microphone access granted</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Internet connection stable</span>
              </div>
            </div>
            
            <button
              onClick={() => setStep(2)}
              disabled={!isVideoOn || !isAudioOn}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Connect with Agent
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Agent connection and KYC process
  if (step === 2) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Call Interface */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg aspect-video relative">
                <div className="absolute inset-4 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  {agentConnected ? (
                    <div className="text-white text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="font-medium mb-1">Priya Sharma</h3>
                      <p className="text-sm text-gray-300">KYC Specialist</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs">Connected</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <Clock className="h-12 w-12 mx-auto mb-3 animate-spin" />
                      <p>Connecting to agent...</p>
                      <p className="text-sm text-gray-400 mt-1">Please wait, you're next in queue</p>
                    </div>
                  )}
                </div>
                
                {/* Self preview */}
                <div className="absolute bottom-4 right-4 w-24 h-18 bg-gray-800 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-gray-400" />
                </div>
                
                {/* Call controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                    {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5 text-red-600" />}
                  </button>
                  <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5 text-red-600" />}
                  </button>
                  <button 
                    onClick={() => onComplete({ success: false, reason: 'user_ended' })}
                    className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* KYC Progress Panel */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">KYC Progress</h3>
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 p-2 rounded ${kycSteps.documentCheck ? 'bg-green-50' : 'bg-white border'}`}>
                    {kycSteps.documentCheck ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : loading ? (
                      <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                    <span className="text-sm">Document Verification</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-2 rounded ${kycSteps.livenessCheck ? 'bg-green-50' : 'bg-white border'}`}>
                    {kycSteps.livenessCheck ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                    <span className="text-sm">Liveness Detection</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-2 rounded ${kycSteps.addressVerification ? 'bg-green-50' : 'bg-white border'}`}>
                    {kycSteps.addressVerification ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                    <span className="text-sm">Address Verification</span>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-2 rounded ${kycSteps.finalApproval ? 'bg-green-50' : 'bg-white border'}`}>
                    {kycSteps.finalApproval ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                    <span className="text-sm">Final Approval</span>
                  </div>
                </div>
              </div>
              
              {agentConnected && (
                <div className="space-y-2">
                  {!kycSteps.documentCheck && (
                    <button
                      onClick={() => simulateKYCStep('documentCheck')}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                    >
                      {loading ? 'Verifying...' : 'Start Document Check'}
                    </button>
                  )}
                  
                  {kycSteps.documentCheck && !kycSteps.livenessCheck && (
                    <button
                      onClick={() => simulateKYCStep('livenessCheck')}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                    >
                      {loading ? 'Checking...' : 'Start Liveness Check'}
                    </button>
                  )}
                  
                  {kycSteps.livenessCheck && !kycSteps.addressVerification && (
                    <button
                      onClick={() => simulateKYCStep('addressVerification')}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                    >
                      {loading ? 'Verifying...' : 'Verify Address'}
                    </button>
                  )}
                  
                  {kycSteps.addressVerification && !kycSteps.finalApproval && (
                    <button
                      onClick={() => {
                        simulateKYCStep('finalApproval');
                        setTimeout(() => {
                          onComplete({ 
                            success: true, 
                            agentId: 'AG001',
                            sessionId: 'VCIP' + Date.now(),
                            completedSteps: kycSteps
                          });
                        }, 3000);
                      }}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition-colors disabled:bg-gray-300"
                    >
                      {loading ? 'Finalizing...' : 'Complete KYC'}
                    </button>
                  )}
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-900">Secure Session</p>
                    <p className="text-xs text-blue-800">
                      This video call is encrypted and recorded for compliance purposes only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}