import React from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface ProductTourProps {
  isRunning: boolean;
  onFinish: () => void;
}

const steps: Step[] = [
  {
    target: '.tour-phone-entry',
    content: 'Welcome to DBS Digital Onboarding! Start by verifying your mobile number for secure access.',
    placement: 'center'
  },
  {
    target: '.tour-welcome',
    content: 'Access all banking services from this central hub - account opening, loans, and application status.',
    placement: 'bottom'
  },
  {
    target: '.tour-pan-entry',
    content: 'Enter your PAN for verification, or skip this step to complete it later at the branch.',
    placement: 'top'
  },
  {
    target: '.tour-kyc-choice', 
    content: 'Choose your preferred KYC method - Aadhaar OTP is instant, or visit a branch for traditional KYC.',
    placement: 'top'
  },
  {
    target: '.tour-account-types',
    content: 'Choose the savings account that best fits your banking needs and lifestyle.',
    placement: 'left'
  },
  {
    target: '.tour-loan-section',
    content: 'Get instant loan eligibility with competitive rates and quick processing.',
    placement: 'right'
  },
  {
    target: '.tour-responsible-ai',
    content: 'Learn about DBS commitment to responsible AI and data protection with Lyzr platform.',
    placement: 'top'
  }
];

export function ProductTour({ isRunning, onFinish }: ProductTourProps) {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={isRunning}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#000000',
        },
        buttonNext: {
          backgroundColor: '#000000',
          color: '#ffffff'
        },
        buttonBack: {
          color: '#666666'
        }
      }}
    />
  );
}