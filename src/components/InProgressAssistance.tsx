import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, AlertTriangle, CheckCircle, User, FileText, HelpCircle, Zap, RefreshCw, TrendingUp } from 'lucide-react';
import personas from '../data/personas.json';
import incentives from '../data/incentives.json';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  assistance?: boolean;
}

interface Event {
  id: string;
  type: 'detection' | 'analysis' | 'intervention' | 'resolution';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'needs_review' | 'blocked';
  trigger?: string;
}

interface FormField {
  id: string;
  name: string;
  value: string;
  status: 'idle' | 'focus' | 'error' | 'completed';
  lastActivity: Date;
  issues?: string[];
}

export function InProgressAssistance() {
  const [selectedPersona, setSelectedPersona] = useState(personas[1]); // Default to freelancer
  const [selectedTier, setSelectedTier] = useState<'T1' | 'T2'>('T2');
  const [scenario, setScenario] = useState('idle_timeout');
  const [isSimulating, setIsSimulating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [currentField, setCurrentField] = useState<string>('');
  const [sessionData, setSessionData] = useState<any>(null);
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeTime: 0,
    fieldsCompleted: 0,
    errorsEncountered: 0,
    assistanceProvided: 0
  });

  const scenarios = [
    { id: 'idle_timeout', name: 'Idle Timeout Detection' },
    { id: 'form_errors', name: 'Form Validation Errors' },
    { id: 'kyc_confusion', name: 'KYC Process Confusion' },
    { id: 'document_issues', name: 'Document Upload Issues' }
  ];

  const initializeFormFields = () => {
    const fields: FormField[] = [
      { id: 'pan', name: 'PAN Number', value: '', status: 'idle', lastActivity: new Date() },
      { id: 'aadhaar', name: 'Aadhaar Number', value: '', status: 'idle', lastActivity: new Date() },
      { id: 'email', name: 'Email Address', value: '', status: 'idle', lastActivity: new Date() },
      { id: 'income', name: 'Monthly Income', value: '', status: 'idle', lastActivity: new Date() },
      { id: 'address', name: 'Address', value: '', status: 'idle', lastActivity: new Date() }
    ];
    setFormFields(fields);
  };

  const addMessage = (type: 'user' | 'agent' | 'system', content: string, assistance: boolean = false) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      assistance
    };
    setMessages(prev => [...prev, message]);
  };

  const addEvent = (type: Event['type'], title: string, description: string, status: Event['status'], trigger?: string) => {
    const event: Event = {
      id: Date.now().toString(),
      type,
      title,
      description,
      timestamp: new Date(),
      status,
      trigger
    };
    setEvents(prev => [...prev, event]);
    
    // Log to admin
    setAdminLogs(prev => [...prev, {
      timestamp: new Date(),
      sessionId: sessionData?.sessionId || 'unknown',
      event: type,
      data: { title, description, status, trigger }
    }]);
    
    // Update metrics
    if (type === 'resolution') {
      setRealTimeMetrics(prev => ({
        ...prev,
        assistanceProvided: prev.assistanceProvided + 1
      }));
    }
  };

  const updateFieldStatus = (fieldId: string, status: FormField['status'], value?: string, issues?: string[]) => {
    setFormFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { 
            ...field, 
            status, 
            value: value !== undefined ? value : field.value,
            lastActivity: new Date(),
            issues: issues || field.issues
          }
        : field
    ));
    
    // Update metrics
    if (status === 'completed') {
      setRealTimeMetrics(prev => ({
        ...prev,
        fieldsCompleted: prev.fieldsCompleted + 1
      }));
    } else if (status === 'error') {
      setRealTimeMetrics(prev => ({
        ...prev,
        errorsEncountered: prev.errorsEncountered + 1
      }));
    }
  };

  const detectIdleTimeout = async () => {
    // Simulate user starting to fill PAN field
    setCurrentField('pan');
    updateFieldStatus('pan', 'focus');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    addMessage('system', 'User started filling PAN number field...');
    
    // Simulate partial input then going idle
    await new Promise(resolve => setTimeout(resolve, 3000));
    updateFieldStatus('pan', 'idle', 'ABCDE');
    addMessage('system', 'User input detected: "ABCDE" (partial PAN)');
    
    // Detect idle state after 30 seconds (simulated as 2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));
    addEvent('detection', 'Idle Timeout Detected', 'User has been inactive on PAN field for 30+ seconds with partial input', 'warning', 'idle_30s');
    
    // AI intervention
    await new Promise(resolve => setTimeout(resolve, 1000));
    addEvent('analysis', 'Intervention Analysis', 'AI determined user may need help with PAN format', 'success');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    addEvent('intervention', 'Assistance Triggered', 'Contextual help bubble displayed with PAN format guidance', 'success');
    
    addMessage('agent', 'Hi! I noticed you\'re entering your PAN number. Just a friendly reminder that the format is 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F). Need any help?', true);
    
    // User responds positively
    await new Promise(resolve => setTimeout(resolve, 2000));
    addMessage('user', 'Oh thank you! I wasn\'t sure about the format. Let me complete it now.');
    
    // User completes the field
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateFieldStatus('pan', 'completed', 'ABCDE1234F');
    addEvent('resolution', 'Field Completed', 'PAN field successfully completed with valid format', 'success');
    
    addMessage('agent', 'Perfect! Your PAN is now validated. Would you like me to guide you through the next steps?', true);
  };

  const simulateFormErrors = async () => {
    // User tries to enter invalid data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentField('email');
    updateFieldStatus('email', 'focus');
    addMessage('system', 'User focused on email field');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateFieldStatus('email', 'error', 'invalid-email', ['Invalid email format']);
    addEvent('detection', 'Validation Error Detected', 'Invalid email format entered: "invalid-email"', 'warning', 'validation_error');
    
    // Multiple failed attempts
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateFieldStatus('email', 'error', 'user@invalid', ['Invalid email format']);
    addEvent('detection', 'Repeated Errors', 'Second consecutive validation error on email field', 'warning', 'multiple_errors');
    
    // AI intervention
    await new Promise(resolve => setTimeout(resolve, 1000));
    addEvent('intervention', 'Smart Help Activated', 'AI provided enhanced email format guidance with examples', 'success');
    
    addMessage('agent', 'I see you\'re having trouble with the email format. Here are some valid examples: user@gmail.com, name@company.co.in. Would you like me to help you format it correctly?', true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    addMessage('user', 'Yes please! I want to use my Gmail address: john.doe.gmail.com');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    addMessage('agent', 'I think you meant john.doe@gmail.com (with @ symbol). Let me auto-correct that for you!', true);
    
    updateFieldStatus('email', 'completed', 'john.doe@gmail.com');
    addEvent('resolution', 'Auto-correction Applied', 'Email auto-corrected and validated successfully', 'success');
  };

  const simulateKYCConfusion = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    addMessage('system', 'User reached KYC method selection screen');
    
    // User spends long time on KYC selection without choosing
    await new Promise(resolve => setTimeout(resolve, 3000));
    addEvent('detection', 'Decision Hesitation', 'User viewing KYC options for 2+ minutes without selection', 'warning', 'kyc_hesitation');
    
    // AI detects confusion pattern
    await new Promise(resolve => setTimeout(resolve, 1500));
    addEvent('analysis', 'Confusion Pattern Detected', 'User behavior indicates uncertainty about KYC options', 'needs_review');
    
    addMessage('agent', 'I notice you\'re looking at the KYC options. Would you like me to explain the differences? Most customers like you choose Aadhaar OTP for quick verification.', true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    addMessage('user', 'Yes, I\'m not sure which one is best for me. What do you recommend?');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    addMessage('agent', 'Based on your profile, I\'d recommend Aadhaar OTP e-KYC - it\'s instant, secure, and takes just 2-3 minutes. You\'ll get instant account activation! Shall I help you with that?', true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    addMessage('user', 'That sounds perfect! Please guide me through it.');
    
    addEvent('resolution', 'KYC Method Selected', 'Customer chose Aadhaar OTP with AI guidance', 'success');
  };

  const simulateDocumentIssues = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    addMessage('system', 'User attempting document upload...');
    
    // Failed upload attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
    addEvent('detection', 'Upload Failure', 'Document upload failed - file size too large (5.2MB)', 'warning', 'file_size_error');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    addEvent('detection', 'Retry Pattern', 'User attempted upload 3 times with same large file', 'warning', 'repeated_failures');
    
    // AI intervention with specific help
    await new Promise(resolve => setTimeout(resolve, 1500));
    addEvent('intervention', 'Smart Resolution', 'AI detected file size issue and provided compression guidance', 'success');
    
    addMessage('agent', 'I see your document upload is failing because the file is too large (5.2MB). Our system accepts files up to 2MB. I can guide you to compress it or use our mobile scanner for better quality. Which would you prefer?', true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    addMessage('user', 'I didn\'t know about the size limit! Can you help me compress it?');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    addMessage('agent', 'Absolutely! You can use any online PDF compressor like SmallPDF or ILovePDF. Alternatively, our mobile app has a built-in scanner that creates optimal-sized files. Would you like the mobile app link?', true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    addMessage('user', 'Yes, the mobile app sounds easier. Please send the link.');
    
    addEvent('resolution', 'Alternative Solution Provided', 'Customer provided mobile app link for document scanning', 'success');
  };

  const startSimulation = async () => {
    setIsSimulating(true);
    setMessages([]);
    setEvents([]);
    initializeFormFields();

    // Initialize session
    const session = {
      sessionId: `IP_${Date.now()}`,
      persona: selectedPersona,
      tier: selectedTier,
      scenario,
      startTime: new Date(),
      currentStep: 'form_filling',
      completionPercentage: 45
    };
    setSessionData(session);

    addMessage('system', `In-progress assistance simulation started for ${selectedPersona.name}`);
    
    // Run scenario-specific simulation
    switch (scenario) {
      case 'idle_timeout':
        await detectIdleTimeout();
        break;
      case 'form_errors':
        await simulateFormErrors();
        break;
      case 'kyc_confusion':
        await simulateKYCConfusion();
        break;
      case 'document_issues':
        await simulateDocumentIssues();
        break;
    }

    // Final success message
    await new Promise(resolve => setTimeout(resolve, 1500));
    addMessage('agent', 'Great! You\'re making excellent progress. I\'ll be here if you need any more help completing your application.', true);
    
    addEvent('resolution', 'Assistance Complete', 'Customer successfully resolved issue and continued application', 'success');
    
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setMessages([]);
    setEvents([]);
    setFormFields([]);
    setSessionData(null);
    setCurrentField('');
    setIsSimulating(false);
  };

  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'needs_review': return <HelpCircle className="h-4 w-4 text-blue-600" />;
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getFieldStatusColor = (status: FormField['status']) => {
    switch (status) {
      case 'focus': return 'border-blue-500 bg-blue-50';
      case 'error': return 'border-red-500 bg-red-50';
      case 'completed': return 'border-green-500 bg-green-50';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-black mb-2">In-Progress Application Assistance</h2>
        <p className="text-gray-600">
          Simulate real-time AI assistance during active application sessions
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Simulation */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Form Fields (Live View)
            </h3>
          </div>
          
          <div className="p-4">
            {formFields.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Start simulation to see form interaction</p>
              </div>
            ) : (
              <div className="space-y-4">
                {formFields.map(field => (
                  <div key={field.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.name}
                      {currentField === field.id && (
                        <span className="ml-2 text-blue-600 text-xs">← Active</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={field.value}
                      readOnly
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${getFieldStatusColor(field.status)}`}
                      placeholder={`Enter ${field.name.toLowerCase()}`}
                    />
                    {field.issues && field.issues.length > 0 && (
                      <div className="text-xs text-red-600">
                        {field.issues.join(', ')}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Status: {field.status} • Last activity: {field.lastActivity.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conversation Panel */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              AI Assistance Chat
            </h3>
          </div>
          
          <div className="p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Start simulation to see AI assistance</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'agent' ? 'justify-start' : message.type === 'user' ? 'justify-end' : 'justify-center'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg relative ${
                        message.type === 'agent' 
                          ? `${message.assistance ? 'bg-green-600' : 'bg-blue-600'} text-white` 
                          : message.type === 'user'
                          ? 'bg-gray-200 text-black'
                          : 'bg-yellow-100 text-yellow-800 text-xs'
                      }`}
                    >
                      {message.assistance && (
                        <div className="absolute -top-2 -right-2">
                          <Zap className="h-4 w-4 text-yellow-400 bg-green-600 rounded-full p-0.5" />
                        </div>
                      )}
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

        {/* Events & Session Info */}
        <div className="space-y-6">
          {/* Real-time Metrics */}
          {sessionData && (
            <div className="bg-white rounded-2xl shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Real-time Metrics
                </h3>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{realTimeMetrics.fieldsCompleted}</div>
                    <div className="text-xs text-blue-800">Fields Completed</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{realTimeMetrics.errorsEncountered}</div>
                    <div className="text-xs text-red-800">Errors</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{realTimeMetrics.assistanceProvided}</div>
                    <div className="text-xs text-green-800">Assists</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{Math.round((new Date().getTime() - (sessionData?.startTime?.getTime() || 0)) / 1000)}s</div>
                    <div className="text-xs text-gray-800">Active Time</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Events Timeline */}
          <div className="bg-white rounded-2xl shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                AI Events
              </h3>
            </div>
            
            <div className="p-4">
              {events.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No events yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {events.map(event => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-black">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.description}</p>
                        {event.trigger && (
                          <p className="text-xs text-blue-600">Trigger: {event.trigger}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{event.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Session Info */}
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
                    <span className="text-gray-600">Current Step</span>
                    <span className="capitalize">{sessionData.currentStep.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completion</span>
                    <span>{sessionData.completionPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Time</span>
                    <span>{Math.round((new Date().getTime() - sessionData.startTime.getTime()) / 1000)}s</span>
                  </div>
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
                        Session: {log.sessionId}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}