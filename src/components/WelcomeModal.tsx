import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/Dialog';
import { Building2, Shield, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartTour: () => void;
}

export function WelcomeModal({ open, onOpenChange, onStartTour }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Building2 className="h-8 w-8 text-black" />
            Welcome to DBS Digital Onboarding Platform
          </DialogTitle>
          <DialogDescription className="text-base mt-4">
            Experience India's most advanced digital banking onboarding with RBI-compliant KYC processes
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Business Value
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">RBI-Compliant Digital KYC</p>
                  <p className="text-sm text-gray-600">Multiple KYC options including Aadhaar OTP and branch visit</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Instant Account Opening</p>
                  <p className="text-sm text-gray-600">Complete account opening process in minutes with digital verification</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Seamless Loan Applications</p>
                  <p className="text-sm text-gray-600">Instant eligibility check with competitive interest rates</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black flex items-center gap-2">
              <Users className="h-5 w-5" />
              AI Role Agents Involved
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">KYC Verification Agent</p>
                <p className="text-xs text-gray-600">Handles document verification, biometric validation, and compliance checks</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">Risk Assessment Agent</p>
                <p className="text-xs text-gray-600">Evaluates creditworthiness, fraud detection, and eligibility scoring</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">Customer Support Agent</p>
                <p className="text-xs text-gray-600">Provides real-time assistance and guides through complex processes</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">Compliance Monitor</p>
                <p className="text-xs text-gray-600">Ensures all processes meet RBI regulations and audit requirements</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-600">Powered by Lyzr AI with comprehensive compliance guardrails</span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-gray-600 hover:text-black transition-colors"
            >
              Skip Tour
            </button>
            <button
              onClick={() => {
                onStartTour();
                onOpenChange(false);
              }}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              Start Product Tour
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}