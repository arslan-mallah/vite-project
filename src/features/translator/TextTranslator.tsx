import { useState, useEffect } from 'react';
import { translationConverter } from '../../core/services/translation-converter.service';

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
    <div style={{ padding: 40, maxWidth: 900, margin: '0 auto' }}>
      <h1>📝 Text Translator</h1>
      <p style={{ color: '#666' }}>Type in English and see real-time translation to your chosen language</p>

      {error && (
        <div style={{ color: 'red', backgroundColor: '#ffe0e0', padding: 10, borderRadius: 4, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Input Section */}
        <div>
          <h3>English (Source)</h3>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type or paste text here in English..."
            style={{
              width: '100%',
              height: 200,
              padding: 12,
              fontSize: 16,
              fontFamily: 'Arial',
              border: '1px solid #ddd',
              borderRadius: 4,
              boxSizing: 'border-box',
            }}
          />
          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleCopy(inputText)}
              style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              📋 Copy
            </button>
            <button
              onClick={() => setInputText('')}
              style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              ✕ Clear
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3>Translation</h3>
            <select
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
              style={{ padding: '8px 12px', fontSize: 14, borderRadius: 4 }}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              width: '100%',
              height: 200,
              padding: 12,
              fontSize: 16,
              fontFamily: 'Arial',
              border: '1px solid #ddd',
              borderRadius: 4,
              backgroundColor: '#f9f9f9',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {loading ? '🔄 Translating...' : translatedText || '(translation appears here)'}
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleCopy(translatedText)}
              style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              📋 Copy
            </button>
            <button
              onClick={handleSwapLanguage}
              style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              🔄 Swap
            </button>
          </div>
        </div>
      </div>

      {/* Available Translations Info */}
      <div style={{ marginTop: 40, padding: 20, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
        <h4>💡 How it works:</h4>
        <ul style={{ lineHeight: 1.8 }}>
          <li>Type or paste English text in the left box</li>
          <li>Select target language from the dropdown</li>
          <li>Translation appears in real-time on the right</li>
          <li>Currently supports: welcome, hello, goodbye, thank you, yes, no, good morning, good night</li>
          <li>Use "Swap" button to reverse translation</li>
          <li>Use "Copy" button to copy text to clipboard</li>
        </ul>
      </div>

      {/* Available Languages */}
      <div style={{ marginTop: 20, padding: 20, backgroundColor: '#e3f2fd', borderRadius: 4 }}>
        <h4>🌍 Supported Languages:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {languages.map(lang => (
            <div key={lang.code} style={{ padding: 10, backgroundColor: 'white', borderRadius: 4 }}>
              {lang.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
