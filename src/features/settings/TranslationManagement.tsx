import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

export function TranslationManagement() {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const currentLang = languages.find(l => l.code === i18n.language);

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: '0 auto', fontFamily: 'Arial' }}>
      <h1>🌐 {t('languageSettings.title')}</h1>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 30 }}>
        {t('languageSettings.subtitle')}
      </p>

      {/* Current Language Display */}
      <div style={{ backgroundColor: '#e3f2fd', padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{t('languageSettings.currentLanguage')}</h3>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold' }}>
          {currentLang?.flag} {currentLang?.name}
        </p>
      </div>

      {/* Language Selection Grid */}
      <h3 style={{ marginBottom: 20 }}>{t('languageSettings.selectLanguage')}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 15 }}>
        {languages.map(language => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            style={{
              padding: 20,
              fontSize: 16,
              border: i18n.language === language.code ? '3px solid #2196F3' : '2px solid #ddd',
              borderRadius: 8,
              backgroundColor: i18n.language === language.code ? '#e3f2fd' : 'white',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontWeight: i18n.language === language.code ? 'bold' : 'normal',
            }}
            onMouseOver={e => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>{language.flag}</div>
            <div>{language.name}</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 5 }}>({language.code.toUpperCase()})</div>
          </button>
        ))}
      </div>

      {/* Info Section */}
      <div style={{ marginTop: 40, padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <h4 style={{ marginTop: 0 }}>ℹ️ {t('languageSettings.aboutTitle')}</h4>
        <ul style={{ lineHeight: 1.8, color: '#666' }}>
          <li>{t('languageSettings.info1')}</li>
          <li>{t('languageSettings.info2')}</li>
          <li>{t('languageSettings.info3')}</li>
          <li>{t('languageSettings.info4')}</li>
        </ul>
      </div>

      {/* Language Statistics */}
      <div style={{ marginTop: 20, padding: 20, backgroundColor: '#f9f9f9', borderRadius: 8, textAlign: 'center' }}>
        <p style={{ color: '#999', fontSize: 14 }}>
          {t('languageSettings.supporting')} <strong>{languages.length}</strong> {t('languageSettings.languages')} 🌍
        </p>
      </div>
    </div>
  );
}
