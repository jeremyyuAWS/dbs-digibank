import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { Progress } from './ui/Progress';
import { Building2, CreditCard, HelpCircle, Shield, User, Phone, ArrowRight } from 'lucide-react';
import { WelcomeModal } from './WelcomeModal';
import { ResponsibleAI } from './ResponsibleAI';
import { ProductTour } from './ProductTour';
import { OnboardingFlow } from './OnboardingFlow';
import { LoanApplication } from './LoanApplication';
import { LoginLink } from './LoginLink';

export function Dashboard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTouring, setIsTouring] = useState(false);
  const [activeTab, setActiveTab] = useState('onboarding');
  const [userState, setUserState] = useState({
    phoneVerified: false,
    onboardingProgress: 0,
    currentApplication: null
  });

  const handleStartTour = () => {
    setIsTouring(true);
  };

  const handlePhoneVerified = () => {
    setUserState(prev => ({ ...prev, phoneVerified: true }));
  };

  const handleProgressUpdate = (progress: number, applicationData?: any) => {
    setUserState(prev => ({ 
      ...prev, 
      onboardingProgress: progress,
      currentApplication: applicationData || prev.currentApplication
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductTour isRunning={isTouring} onFinish={() => setIsTouring(false)} />
      
      <WelcomeModal 
        open={showWelcome}
        onOpenChange={setShowWelcome}
        onStartTour={handleStartTour}
      />

      {/* Header with DBS Logo */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/DBS-bank-logo.jpeg" 
                alt="DBS Bank"
                className="h-8 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-black">digibank by DBS</h1>
                <p className="text-xs text-gray-500">Digital Banking Platform - India</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowWelcome(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-black transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                Help
              </button>
              
              {userState.phoneVerified && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar - Only show during onboarding */}
      {activeTab === 'onboarding' && userState.onboardingProgress > 0 && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Account Opening Progress</span>
              <span className="text-sm text-gray-500">{userState.onboardingProgress}% Complete</span>
            </div>
            <Progress value={userState.onboardingProgress} className="h-2" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!userState.phoneVerified ? (
          // Phone Verification Screen (Screen 03)
          <div className="tour-phone-entry max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <img 
                src="/DBS-bank-logo.jpeg" 
                alt="DBS Bank"
                className="h-12 w-auto mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold text-black mb-4">Welcome to digibank by DBS</h2>
              <p className="text-gray-600 mb-6">
                Enter your mobile number to get started with instant account opening
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                // Simulate OTP verification
                setTimeout(() => handlePhoneVerified(), 1000);
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Send OTP
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              
              <p className="text-xs text-gray-500 mt-4">
                By proceeding, you agree to DBS terms and conditions
              </p>
            </div>
          </div>
        ) : (
          // Main App Tabs (Screen 04 - Home Hub)
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="tour-welcome">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
                <TabsTrigger value="onboarding" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Open Account
                </TabsTrigger>
                <TabsTrigger value="loans" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Personal Loan
                </TabsTrigger>
                <TabsTrigger value="login-link" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Check Status
                </TabsTrigger>
                <TabsTrigger value="responsible-ai" className="tour-responsible-ai flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Responsible AI
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="onboarding" className="space-y-8">
              <OnboardingFlow 
                onProgressUpdate={handleProgressUpdate}
                currentProgress={userState.onboardingProgress}
              />
            </TabsContent>

            <TabsContent value="loans" className="space-y-8">
              <LoanApplication />
            </TabsContent>

            <TabsContent value="login-link" className="space-y-8">
              <LoginLink userState={userState} />
            </TabsContent>

            <TabsContent value="responsible-ai" className="space-y-8">
              <ResponsibleAI />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}