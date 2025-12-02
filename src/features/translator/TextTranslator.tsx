import { useState, useEffect } from 'react';
import { translationConverter } from '../../core/services/translation-converter.service';
import { PageWrapper } from '../../core/components/PageWrapper';

export function TextTranslator() {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ur', name: 'Urdu' },
  ];

  // Real-time translation
  useEffect(() => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    const translateText = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await translationConverter.translateSentence(inputText, targetLanguage);
        setTranslatedText(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Translation failed');
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to avoid too many requests
    const timer = setTimeout(translateText, 500);
    return () => clearTimeout(timer);
  }, [inputText, targetLanguage]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleSwapLanguage = () => {
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  return (
    <PageWrapper 
      title="📝 Text Translator" 
      subtitle="Translate text in real-time across 13 languages"
    >
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Translation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            English (Source)
          </h3>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type or paste text here in English..."
            className="w-full h-40 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleCopy(inputText)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              📋 Copy
            </button>
            <button
              onClick={() => setInputText('')}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              ✕ Clear
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Translation
            </h3>
            <select
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div
            className="w-full h-40 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white overflow-y-auto whitespace-pre-wrap word-wrap"
          >
            {loading ? '🔄 Translating...' : translatedText || '(translation appears here)'}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleCopy(translatedText)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              📋 Copy
            </button>
            <button
              onClick={handleSwapLanguage}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              🔄 Swap
            </button>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-800 p-6 rounded-lg mb-8">
        <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">💡 How it works:</h4>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li className="flex items-start">
            <span className="mr-3">✓</span>
            <span>Type or paste English text in the left box</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3">✓</span>
            <span>Select target language from the dropdown</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3">✓</span>
            <span>Translation appears in real-time on the right</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3">✓</span>
            <span>Currently supports: welcome, hello, goodbye, thank you, yes, no, good morning, good night</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3">✓</span>
            <span>Use "Swap" button to reverse translation</span>
          </li>
          <li className="flex items-start">
            <span className="mr-3">✓</span>
            <span>Use "Copy" button to copy text to clipboard</span>
          </li>
        </ul>
      </div>

      {/* Supported Languages */}
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">🌍 Supported Languages:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {languages.map(lang => (
            <div 
              key={lang.code}
              className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-600 text-center font-semibold text-slate-900 dark:text-white hover:shadow-md transition-shadow"
            >
              {lang.name}
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
