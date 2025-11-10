'use client';

import { useState } from 'react';

type Provider = 'gemini' | 'ollama';
type GeminiModel = 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' | 'gemini-2.0-flash' | 'gemini-2.0-flash-lite';
type OllamaModel = 'llama3.2:3b' | 'mistral:7b' | 'llama3.1:8b';
type Model = GeminiModel | OllamaModel;

export default function Home() {
  const [text, setText] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);
  const [extractedQuestions, setExtractedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<Provider>('gemini');
  const [selectedModel, setSelectedModel] = useState<Model>('gemini-2.0-flash-lite');
  const [progress, setProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('');

  const getAnswers = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setAnswers([]);
    setProgress(0);
    setCurrentStatus('');

    try {
      const response = await fetch('/api/get-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model: selectedModel, provider: selectedProvider }),
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Check if response is streaming (SSE)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('No reader available');

        let allAnswers: any[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.type === 'status') {
                  setCurrentStatus(data.message);
                  if (data.progress !== undefined) {
                    setProgress(data.progress);
                  }
                } else if (data.type === 'questions') {
                  // Questions extracted, continue processing
                  setProgress(data.progress || 40);
                } else if (data.type === 'batch_complete') {
                  allAnswers = [...allAnswers, ...data.data];
                  setAnswers([...allAnswers]);
                  setProgress(data.progress || 60);
                } else if (data.type === 'complete') {
                  setAnswers(data.answers);
                  setProgress(100);
                  setCurrentStatus('✅ Complete!');
                } else if (data.type === 'error') {
                  throw new Error(data.message);
                }
              } catch (parseError) {
                console.warn('Error parsing SSE data:', parseError, 'Raw line:', line);
                // Continue processing other lines
              }
            }
          }
        }
      } else {
        // Fallback: Handle regular JSON response
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setAnswers(data.answers || []);
        setProgress(100);
        setCurrentStatus('✅ Complete!');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to get answers');
      setProgress(0);
      setCurrentStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6 md:py-10 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Quiz Answer Finder
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Paste your quiz content and get instant answers
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-8 mb-6">
          {/* Provider Selector */}
          <div className="mb-6">
            <label htmlFor="provider-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              AI Provider
            </label>
            <select
              id="provider-select"
              value={selectedProvider}
              onChange={(e) => {
                const newProvider = e.target.value as Provider;
                setSelectedProvider(newProvider);
                // Reset model to default for the new provider
                if (newProvider === 'gemini') {
                  setSelectedModel('gemini-2.0-flash-lite');
                } else {
                  setSelectedModel('llama3.2:3b');
                }
              }}
              className="w-full p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 text-sm md:text-base cursor-pointer"
            >
              <option value="gemini">🤖 Google Gemini (Fast & Accurate)</option>
              <option value="ollama">🦙 Ollama (Unlimited & Local)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {selectedProvider === 'gemini' && '⚡ Cloud-based AI with rate limits but high accuracy'}
              {selectedProvider === 'ollama' && '🏠 Self-hosted AI with unlimited usage (requires setup)'}
            </p>
          </div>

          {/* Model Selector */}
          <div className="mb-6">
            <label htmlFor="model-select" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              AI Model
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as Model)}
              className="w-full p-3 md:p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 text-sm md:text-base cursor-pointer"
            >
              {selectedProvider === 'gemini' ? (
                <>
                  <option value="gemini-2.0-flash-lite">⚡ Gemini 2.0 Flash Lite (Fastest & Free Tier)</option>
                  <option value="gemini-2.0-flash">🚀 Gemini 2.0 Flash (Fast & Accurate)</option>
                  <option value="gemini-2.5-flash-lite">💨 Gemini 2.5 Flash Lite (Stable)</option>
                  <option value="gemini-2.5-flash">💎 Gemini 2.5 Flash (Most Accurate)</option>
                </>
              ) : (
                <>
                  <option value="llama3.2:3b">🦙 Llama 3.2 3B (Fast & Efficient)</option>
                  <option value="mistral:7b">🌪️ Mistral 7B (Balanced Performance)</option>
                  <option value="llama3.1:8b">🦙 Llama 3.1 8B (High Accuracy)</option>
                </>
              )}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {selectedProvider === 'gemini' ? (
                <>
                  {selectedModel === 'gemini-2.0-flash-lite' && '⚡ Ultra-fast responses, best for free tier quota'}
                  {selectedModel === 'gemini-2.0-flash' && '🚀 Latest model with great speed and accuracy'}
                  {selectedModel === 'gemini-2.5-flash-lite' && '💨 Stable and reliable performance'}
                  {selectedModel === 'gemini-2.5-flash' && '💎 Best accuracy for complex questions'}
                </>
              ) : (
                <>
                  {selectedModel === 'llama3.2:3b' && '🦙 Fast and efficient for most tasks'}
                  {selectedModel === 'mistral:7b' && '🌪️ Great balance of speed and accuracy'}
                  {selectedModel === 'llama3.1:8b' && '🦙 Higher accuracy for complex questions'}
                </>
              )}
            </p>
          </div>

          {/* Progress Section */}
          {loading && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{currentStatus || 'Processing...'}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {/* Thinking Animation */}
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <label htmlFor="quiz-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Quiz Content
          </label>
          <textarea
            id="quiz-input"
            className="w-full h-48 md:h-64 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 placeholder-gray-400 resize-none text-sm md:text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the quiz text here..."
          />
          <button
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 md:py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm md:text-base"
            onClick={getAnswers}
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {currentStatus || 'Getting Answers...'}
              </span>
            ) : (
              '✨ Get Answers'
            )}
          </button>

          {/* Progress Bar */}
          {loading && progress > 0 && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">{progress}% complete</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <p className="text-red-700 dark:text-red-400 font-medium text-sm md:text-base">{error}</p>
            </div>
          </div>
        )}

        {/* Answers Section */}
        {answers.length > 0 && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                📝 Answers ({answers.length})
              </h2>
              <button
                onClick={() => setAnswers([])}
                className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-4 md:space-y-5">
              {answers.map((item, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Question */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
                        {index + 1}
                      </span>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-base leading-relaxed pt-1">
                        {item.question}
                      </p>
                    </div>
                  </div>
                  
                  {/* Answer */}
                  <div className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 text-2xl">✅</span>
                      <div className="flex-1">
                        <p className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Correct Answer{Array.isArray(item.answer) && item.answer.length > 1 ? 's' : ''}
                        </p>
                        {Array.isArray(item.answer) ? (
                          <div className="space-y-2">
                            {item.answer.map((ans: string, ansIndex: number) => (
                              <div
                                key={ansIndex}
                                className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 px-4 py-3 rounded-r-lg"
                              >
                                <p className="text-green-700 dark:text-green-300 font-medium text-sm md:text-base leading-relaxed">
                                  {ans}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 px-4 py-3 rounded-r-lg">
                            <p className="text-green-700 dark:text-green-300 font-medium text-sm md:text-base leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && answers.length === 0 && !error && text.trim() && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-600">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm md:text-base">Click "Get Answers" to start</p>
          </div>
        )}
      </div>
    </main>
  );
}