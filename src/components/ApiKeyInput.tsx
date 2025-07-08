
import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Key, CheckCircle2, XCircle } from 'lucide-react';

interface ApiKeyInputProps {
  className?: string;
  compact?: boolean;
  onSave?: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ 
  className, 
  compact = false,
  onSave
}) => {
  const [apiKey, setApiKey] = useLocalStorage<string>('openai-api-key', '');
  const [inputValue, setInputValue] = useState(apiKey || '');
  const [showInput, setShowInput] = useState(!apiKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const handleSave = () => {
    setApiKey(inputValue.trim());
    setShowInput(false);
    if (onSave) onSave();
  };

  const testApiKey = async () => {
    try {
      setTestStatus('testing');
      
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${inputValue.trim()}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setTestStatus('success');
        setTimeout(() => {
          handleSave();
          setTestStatus('idle');
        }, 1000);
      } else {
        setTestStatus('error');
        setTimeout(() => setTestStatus('idle'), 2000);
      }
    } catch (error) {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 2000);
    }
  };

  if (compact) {
    if (!showInput) {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          className={className}
          onClick={() => setShowInput(true)}
        >
          <Key className="h-4 w-4 mr-2" />
          {apiKey ? 'Change API Key' : 'Add API Key'}
        </Button>
      );
    }
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter OpenAI API Key"
          className="text-xs h-8"
        />
        <Button 
          size="sm" 
          className="h-8 px-2"
          onClick={testApiKey}
          disabled={testStatus === 'testing'}
        >
          {testStatus === 'testing' ? 'Testing...' : 
           testStatus === 'success' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
           testStatus === 'error' ? <XCircle className="h-4 w-4 text-red-500" /> : 'Save'}
        </Button>
      </div>
    );
  }

  // Full version
  if (!showInput && apiKey) {
    return (
      <div className={`mb-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Key className="h-5 w-5 mr-2 text-green-500" />
            <span className="text-sm">API Key configured</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowInput(true)}
          >
            Change
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <Label htmlFor="api-key">OpenAI API Key</Label>
        <div className="text-sm text-muted-foreground mb-2">
          Required for text-to-speech and AI features.{' '}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Get an API key
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          id="api-key"
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="sk-..."
          className="flex-1"
        />
        <Button 
          onClick={testApiKey}
          disabled={!inputValue.trim() || testStatus === 'testing'}
        >
          {testStatus === 'testing' ? 'Testing...' : 
           testStatus === 'success' ? <CheckCircle2 className="h-4 w-4 mr-2" /> : 
           testStatus === 'error' ? <XCircle className="h-4 w-4 mr-2" /> : ''}
          {testStatus === 'success' ? 'Verified' : 
           testStatus === 'error' ? 'Invalid' : 
           'Verify & Save'}
        </Button>
      </div>
    </div>
  );
};

export default ApiKeyInput;
