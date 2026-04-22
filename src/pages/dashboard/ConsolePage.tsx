import { useState } from 'react';
import { Send, Settings2, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectOption } from '@/components/ui/select';
import { useConsoleStore } from '@/stores/console-store';
import { routingModes } from '@/lib/constants';
import type { ConsoleMessage } from '@/types/dashboard';

const mockModels = [
  { slug: 'gpt-4.1', name: 'GPT-4.1' },
  { slug: 'claude-3-opus', name: 'Claude 3 Opus' },
  { slug: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { slug: 'gemini-pro', name: 'Gemini Pro' },
  { slug: 'llama-3-70b', name: 'Llama 3 70B' },
  { slug: 'mistral-large', name: 'Mistral Large' },
];

const mockResponses: Record<string, string> = {
  'gpt-4.1': "Hello! I'm GPT-4.1, ready to help you with any questions or tasks.",
  'claude-3-opus': "Hi there! Claude 3 Opus here. I'd be happy to assist you today.",
  'gemini-pro': "Greetings! I'm Gemini Pro. What can I help you with?",
  'default': "I'm an AI assistant. How can I help you today?",
};

export function ConsolePage() {
  const {
    messages,
    currentModel,
    routingMode,
    temperature,
    maxTokens,
    setModel,
    setRoutingMode,
    setTemperature,
    setMaxTokens,
    addMessage,
    clearMessages,
    isStreaming,
    setStreaming,
  } = useConsoleStore();

  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ConsoleMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    addMessage(userMessage);
    setInput('');
    setStreaming(true);

    // Simulate AI response
    setTimeout(() => {
      const response = mockResponses[currentModel] || mockResponses['default'];
      const assistantMessage: ConsoleMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        tokens: response.length,
        model: currentModel,
      };
      addMessage(assistantMessage);
      setStreaming(false);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="API Console"
        description="Test models and view responses in real-time"
        action={
          <Button variant="outline" size="sm" onClick={clearMessages}>
            Clear Chat
          </Button>
        }
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Chat area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex-1 overflow-y-auto rounded-lg border bg-card p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">Start a conversation</p>
                  <p className="text-sm">Select a model and send a message to test the API</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                      {msg.model && <span>{msg.model}</span>}
                      {msg.tokens && <span>{msg.tokens} tokens</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-lg p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[44px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} variant="spark" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Settings panel */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Configuration
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2">Model</label>
              <Select value={currentModel} onChange={(e) => setModel(e.target.value)}>
                {mockModels.map((m) => (
                  <SelectOption key={m.slug} value={m.slug} label={m.name} />
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Routing Mode</label>
              <Select value={routingMode} onChange={(e) => setRoutingMode(e.target.value as any)}>
                {routingModes.map((m) => (
                  <SelectOption key={m.value} value={m.value} label={m.label} />
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Temperature: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Max Tokens: {maxTokens}
              </label>
              <input
                type="range"
                min="256"
                max="8192"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
