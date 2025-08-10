import React, { useState } from 'react';
import { Wallet, Star, Briefcase, CheckCircle, Info, TrendingUp } from 'lucide-react';
import accountTypes from '../data/account-types.json';

interface AccountSelectorProps {
  onAccountSelect: (account: any) => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'digital-savings': Wallet,
  'premium-savings': Star,
  'salary-account': Briefcase
};

export function AccountSelector({ onAccountSelect }: AccountSelectorProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account.id);
    onAccountSelect(account);
  };

  return (
    <div className="tour-account-types space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Choose Your Account Type</h2>
        <p className="text-gray-600">
          Select the savings account that best fits your banking needs and lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {accountTypes.map((account) => {
          const IconComponent = iconMap[account.id];
          const isSelected = selectedAccount === account.id;
          const isPopular = account.id === 'digital-savings';
          
          return (
            <div
              key={account.id}
              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md relative ${
                isSelected ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleAccountSelect(account)}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <IconComponent className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-black">{account.name}</h3>
                  </div>
                </div>
                {isSelected && <CheckCircle className="h-6 w-6 text-green-600" />}
              </div>

              <p className="text-gray-600 mb-4">{account.description}</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Interest Rate</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{account.interestRate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Minimum Balance</span>
                  <span className="font-medium">
                    {account.minBalance === 0 ? 'Zero Balance' : `₹${account.minBalance.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Limit</span>
                  <span className="font-medium">₹{account.monthlyLimit.toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500">Key Features:</p>
                  <div className="space-y-1">
                    {account.features.slice(0, 4).map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                    {account.features.length > 4 && (
                      <span className="text-xs text-blue-600">+{account.features.length - 4} more features</span>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-blue-900">KYC Requirements</p>
                      <p className="text-xs text-blue-800">{account.kycRequired}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedAccount && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Account Selection Confirmed</h4>
              <p className="text-sm text-green-800 mt-1">
                Your {accountTypes.find(a => a.id === selectedAccount)?.name} is ready to be opened. 
                Complete your KYC verification to activate all features and start banking immediately.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}