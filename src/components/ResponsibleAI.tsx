import React from 'react';
import { Shield, Lock, Eye, FileText, Users, AlertTriangle } from 'lucide-react';

export function ResponsibleAI() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-black mb-4">Responsible AI in Banking</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          DBS leverages Lyzr's advanced AI platform with comprehensive guardrails to ensure secure, 
          transparent, and compliant digital banking experiences for all customers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <Shield className="h-8 w-8 text-green-600 mb-4" />
          <h3 className="font-semibold text-lg mb-3">AI Guardrails</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Bias detection and mitigation algorithms</li>
            <li>• Automated compliance monitoring</li>
            <li>• Real-time risk assessment</li>
            <li>• Ethical decision-making frameworks</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <Lock className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-semibold text-lg mb-3">Data Privacy</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• End-to-end encryption for all data</li>
            <li>• Minimal data collection principles</li>
            <li>• Secure data storage and processing</li>
            <li>• GDPR and RBI compliance</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <Eye className="h-8 w-8 text-purple-600 mb-4" />
          <h3 className="font-semibold text-lg mb-3">Transparency</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Clear AI decision explanations</li>
            <li>• Audit trails for all processes</li>
            <li>• Open model performance metrics</li>
            <li>• Customer data access rights</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <FileText className="h-8 w-8 text-orange-600 mb-4" />
          <h3 className="font-semibold text-lg mb-3">Compliance</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• RBI Master Direction adherence</li>
            <li>• KYC and AML compliance</li>
            <li>• Regular regulatory audits</li>
            <li>• Automated compliance reporting</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <Users className="h-8 w-8 text-teal-600 mb-4" />
          <h3 className="font-semibold text-lg mb-3">Human Oversight</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Human-in-the-loop for critical decisions</li>
            <li>• Manual review processes</li>
            <li>• Customer appeal mechanisms</li>
            <li>• Expert validation protocols</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
          <h3 className="font-semibold text-lg mb-3">Risk Management</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Continuous model monitoring</li>
            <li>• Fraud detection algorithms</li>
            <li>• Anomaly detection systems</li>
            <li>• Proactive risk mitigation</li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Our AI Commitment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-medium mb-3">Ethical AI Principles</h4>
            <p className="text-gray-600 text-sm mb-4">
              Every AI decision is guided by principles of fairness, accountability, and transparency. 
              We ensure our algorithms serve all customers equitably while maintaining the highest 
              standards of security and compliance.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Continuous Improvement</h4>
            <p className="text-gray-600 text-sm mb-4">
              Our AI systems undergo regular audits, performance reviews, and ethical assessments. 
              We continuously refine our models to reduce bias, improve accuracy, and enhance 
              customer experience while maintaining regulatory compliance.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <a 
            href="https://www.lyzr.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Learn more about Lyzr's AI Platform
            <FileText className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-md border text-center">
          <div className="text-2xl font-bold text-green-600">99.9%</div>
          <div className="text-sm text-gray-600">AI Decision Accuracy</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md border text-center">
          <div className="text-2xl font-bold text-blue-600">100%</div>
          <div className="text-sm text-gray-600">Regulatory Compliance</div>
        </div>
      </div>
    </div>
  );
}