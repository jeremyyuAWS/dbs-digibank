import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, Gift, User, AlertCircle, CheckCircle, Phone, Mail, MessageSquare, RefreshCw, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import personas from '../data/personas.json';
import incentives from '../data/incentives.json';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface Event {
  id: string;
  type: 'trigger' | 'analysis' | 'decision' | 'action' | 'outcome';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'needs_review' | 'blocked';
  metadata?: any;
}

export function DropoffRecovery() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [selectedTier, setSelectedTier] = useState<'T1' | 'T2'>('T1');
  const [scenario, setScenario] = useState('standard');
  const [isSimulating, setIsSimulating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sessionData, setSessionData] = useState<any>(null);
  const [selectedIncentive, setSelectedIncentive] = useState<any>(null);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [complianceCheck, setComplianceCheck] = useState<any>(null);

  const scenarios = [
    { id: 'standard', name: 'Standard Drop-off Recovery' },
    { id: 'tier_upgrade', name: 'Mid-Journey Tier Upgrade' },
    { id: 'doc_issues', name: 'Document Validation Issues' },
    { id: 'channel_failure', name: 'Channel Communication Failure' }
  ];

  const addMessage = (type: 'user' | 'agent' | 'system', content: string, metadata?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata
    };
    setMessages(prev => [...prev, message]);
  };

  const addEvent = (type: Event['type'], title: string, description: string, status: Event['status'], metadata?: any) => {
    const event: Event = {
      id: Date.now().toString(),
      type,
      title,
      description,
      timestamp: new Date(),
      status,
      metadata
    };
    setEvents(prev => [...prev, event]);
  };

  const calculateLeadScore = () => {
    const baseScore = selectedPersona.profile.income / 1000;
    const tierMultiplier = selectedTier === 'T1' ? 1.5 : 1.0;
    const dropOffPenalty = 0.7; // Dropped off, so lower score
    
    return Math.round(baseScore * tierMultiplier * dropOffPenalty);
  };

  const selectIncentive = () => {
    const tierIncentives = incentives.find(i => i.tier === selectedTier);
    const scenarioIncentives = tierIncentives?.scenarios.drop_off_recovery;
    
    if (scenarioIncentives && scenarioIncentives.options.length > 0) {
      // Select incentive based on persona and lead score
      const leadScore = calculateLeadScore();
      const incentiveIndex = leadScore > 300 ? 0 : leadScore > 150 ? 1 : 0;
      const selectedIncentive = scenarioIncentives.options[Math.min(incentiveIndex, scenarioIncentives.options.length - 1)];
      
      // Add compliance check
      const maxAllowed = scenarioIncentives.max_incentive;
      const isCompliant = selectedIncentive.amount <= maxAllowed;
      
      setComplianceCheck({
        incentive: selectedIncentive,
        maxAllowed,
        isCompliant,
        tier: selectedTier,
        reason: isCompliant ? 'Within tier limits' : 'Exceeds tier limits'
      });
      
      return selectedIncentive;
    }
    return null;
  };

  const startSimulation = async () => {
    setIsSimulating(true);
    setMessages([]);
    setEvents([]);
    setSelectedIncentive(null);

    // Initialize session data
    const session = {
      sessionId: `DR_${Date.now()}`,
      persona: selectedPersona,
      tier: selectedTier,
      scenario,
      startTime: new Date(),
      leadScore: calculateLeadScore(),
      dropOffPoint: 'kyc_verification',
      timeSinceDropOff: '2 hours',
      previousAttempts: 1
    };
    setSessionData(session);

    // Event 1: Drop-off Detection
    await new Promise(resolve => setTimeout(resolve, 1000));
    addEvent('trigger', 'Drop-off Detected', `Customer ${selectedPersona.name} abandoned application at KYC verification step`, 'warning', {
      dropOffPoint: 'kyc_verification',
      timeElapsed: '2 hours',
      completionPercentage: 75
    });

    // Event 2: Lead Analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    const leadScore = calculateLeadScore();
    addEvent('analysis', 'Lead Scoring Complete', `Calculated lead score: ${leadScore}/500. Customer classified as ${selectedTier} tier`, 'success', {
      leadScore,
      tier: selectedTier,
      factors: ['income_level', 'asset_value', 'banking_relationship']
    });

    // Event 3: Incentive Decision
    await new Promise(resolve => setTimeout(resolve, 1000));
    const incentive = selectIncentive();
    setSelectedIncentive(incentive);
    addEvent('decision', 'Incentive Authorization', `Approved ${incentive?.type} worth ₹${incentive?.amount} (within ₹${incentives.find(i => i.tier === selectedTier)?.scenarios.drop_off_recovery.max_incentive} limit)`, 'success', {
      incentive,
      complianceCheck: true,
      tierLimit: incentives.find(i => i.tier === selectedTier)?.scenarios.drop_off_recovery.max_incentive
    });

    // Log admin data
    setAdminLogs(prev => [...prev, {
      timestamp: new Date(),
      sessionId: session.sessionId,
      event: 'incentive_authorized',
      data: {
        tier: selectedTier,
        incentive,
        complianceCheck,
        leadScore
      }
    }]);
    // Event 4: Channel Selection
    await new Promise(resolve => setTimeout(resolve, 800));
    addEvent('decision', 'Outreach Channel Selected', `Chosen ${selectedPersona.profile.preferredChannel} based on persona preferences`, 'success', {
      channel: selectedPersona.profile.preferredChannel,
      alternatives: ['SMS', 'Email', 'WhatsApp']
    });

    // Start conversation simulation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // System message about outreach
    addMessage('system', `Initiating drop-off recovery for ${selectedPersona.name} via ${selectedPersona.profile.preferredChannel}`);

    // Agent initial contact
    await new Promise(resolve => setTimeout(resolve, 1500));
    addMessage('agent', `Hi ${selectedPersona.name.split(' ')[0]}, I noticed you were opening a savings account with us earlier. Is there anything I can help you complete the process?`);

    // User response (simulated based on persona)
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (scenario === 'doc_issues') {
      addMessage('user', `Hi, yes I was having trouble with the document upload. The KYC verification kept failing and I wasn't sure what to do.`);
    } else if (scenario === 'tier_upgrade') {
      addMessage('user', `Hello, I started the application but I'm wondering if I qualify for any premium accounts given my banking relationship.`);
    } else {
      addMessage('user', `Hi there, yes I was in the middle of it but got busy with work. Planning to complete it later.`);
    }

    // Agent response with incentive
    await new Promise(resolve => setTimeout(resolve, 2500));
    if (scenario === 'doc_issues') {
      addMessage('agent', `I understand the frustration with document uploads. Let me help you with that right now. I can also offer you a ${incentive?.description} to make up for the inconvenience.`);
    } else if (scenario === 'tier_upgrade') {
      addMessage('agent', `Great question! Based on your profile, you actually qualify for our Premium Banking. I can upgrade your application and offer you a ${incentive?.description} as a welcome benefit.`);
      
      // Trigger tier change
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSelectedTier('T1');
      addEvent('decision', 'Tier Upgrade Initiated', 'Customer upgraded from T2 to T1 during recovery conversation', 'success', {
        previousTier: selectedTier,
        newTier: 'T1',
        upgradeReason: 'profile_eligibility'
      });
    } else {
      addMessage('agent', `No worries! To help you complete it quickly, I can offer you a ${incentive?.description}. Would you like to finish your application now? I can assist you step by step.`);
    }

    // User acceptance
    await new Promise(resolve => setTimeout(resolve, 2000));
    addMessage('user', `That sounds great! Yes, I'd like to complete it now. Thank you for the offer.`);

    // Agent assistance
    await new Promise(resolve => setTimeout(resolve, 1500));
    addMessage('agent', `Perfect! I'm sending you a personalized link to continue right where you left off. All your previous information is saved. The ${incentive?.description} will be automatically applied once your account is active.`);

    // Final events
    await new Promise(resolve => setTimeout(resolve, 1000));
    addEvent('action', 'Recovery Link Sent', 'Personalized resumption link sent with pre-filled data', 'success', {
      linkType: 'personalized_resume',
      dataRetention: '95%',
      incentiveAttached: true
    });

    await new Promise(resolve => setTimeout(resolve, 800));
    addEvent('outcome', 'Recovery Success', 'Customer re-engaged and ready to complete application', 'success', {
      engagementTime: '00:03:45',
      incentiveAccepted: true,
      nextStep: 'resume_application',
      expectedConversion: '85%'
    });

    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setMessages([]);
    setEvents([]);
    setSessionData(null);
    setSelectedIncentive(null);
    setIsSimulating(false);
  };

  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'needs_review': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': case 'chat': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Drop-off Recovery Simulation</h2>
        <p className="text-gray-600">
          Simulate AI-driven customer recovery with personalized incentives and real-time assistance
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Persona</label>
            <select
              value={selectedPersona.id}
              onChange={(e) => setSelectedPersona(personas.find(p => p.id === e.target.value) || personas[0])}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {personas.map(persona => (
                <option key={persona.id} value={persona.id}>{persona.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value as 'T1' | 'T2')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="T1">T1 - High Value</option>
              <option value="T2">T2 - Standard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scenario</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className="flex-1 bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                'Start Simulation'
              )}
            </button>
            <button
              onClick={resetSimulation}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Recovery Conversation
                </h3>
                {sessionData && (
                  <div className="flex items-center gap-2">
                    {getChannelIcon(selectedPersona.profile.preferredChannel)}
                    <span className="text-sm text-gray-500">{selectedPersona.profile.preferredChannel}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Start simulation to see the recovery conversation</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'agent' ? 'justify-start' : message.type === 'user' ? 'justify-end' : 'justify-center'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'agent' 
                            ? 'bg-blue-600 text-white' 
                            : message.type === 'user'
                            ? 'bg-gray-200 text-black'
                            : 'bg-yellow-100 text-yellow-800 text-xs'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.type === 'system' ? 'hidden' : 'opacity-75'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Center Panel - Artifacts */}
        <div className="space-y-6">
          {/* Document Artifacts */}
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Artifacts
              </h3>
            </div>
            
            <div className="p-4">
              {scenario === 'doc_issues' ? (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">Document Validation Issues</h4>
                    <div className="text-sm text-red-800 space-y-1">
                      <p>• PAN OCR: Confidence 65% (Below 80% threshold)</p>
                      <p>• Image quality: Poor lighting detected</p>
                      <p>• Format: JPG instead of recommended PDF</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">AI Recommendations</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p>• Use mobile scanner for better quality</p>
                      <p>• Ensure proper lighting</p>
                      <p>• Convert to PDF format</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No document artifacts for this scenario</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Lead Scoring Breakdown */}
          {sessionData && (
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Lead Scoring Breakdown
                </h3>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Base Score (Income)</span>
                    <span className="font-medium">{Math.round(selectedPersona.profile.income / 1000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tier Multiplier</span>
                    <span className="font-medium">{selectedTier === 'T1' ? '1.5x' : '1.0x'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Drop-off Penalty</span>
                    <span className="font-medium text-red-600">0.7x</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center font-semibold">
                    <span>Final Lead Score</span>
                    <span className="text-lg">{sessionData.leadScore}/500</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Events Timeline */}
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Event Timeline
              </h3>
            </div>
            
            <div className="p-4">
              {events.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No events yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {events.map(event => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-black">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{event.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Incentive Details */}
          {selectedIncentive && (
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Incentive Details
                </h3>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="font-medium capitalize">{selectedIncentive.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Value</span>
                    <span className="font-medium text-green-600">₹{selectedIncentive.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tier Limit</span>
                    <span className="text-sm">₹{incentives.find(i => i.tier === selectedTier)?.scenarios.drop_off_recovery.max_incentive}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-800">{selectedIncentive.description}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Logs */}
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Admin Logs
              </h3>
            </div>
            
            <div className="p-4">
              {adminLogs.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No logs yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {adminLogs.map((log, index) => (
                    <div key={index} className="text-xs bg-gray-50 p-2 rounded font-mono">
                      <div className="text-gray-500">{log.timestamp.toISOString()}</div>
                      <div className="font-semibold">{log.event}</div>
                      <div className="text-gray-600 mt-1">
                        {JSON.stringify(log.data, null, 2).slice(0, 100)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Session Data */}
          {sessionData && (
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Session Info
                </h3>
              </div>
              
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session ID</span>
                    <span className="font-mono text-xs">{sessionData.sessionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lead Score</span>
                    <span className="font-medium">{sessionData.leadScore}/500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drop-off Point</span>
                    <span className="capitalize">{sessionData.dropOffPoint.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Since Drop-off</span>
                    <span>{sessionData.timeSinceDropOff}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}