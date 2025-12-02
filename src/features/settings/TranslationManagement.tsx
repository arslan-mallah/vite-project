import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../../core/components/PageWrapper';

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
    <PageWrapper title="🌐 Language Settings" subtitle={t('languageSettings.subtitle')}>
      {/* Current Language Display */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mb-8">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
          {t('languageSettings.currentLanguage')}
        </h3>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {currentLang?.flag} {currentLang?.name}
        </p>
      </div>

      {/* Language Selection Grid */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {t('languageSettings.selectLanguage')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {languages.map(language => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`group p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                i18n.language === language.code
                  ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500 shadow-lg'
                  : 'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:shadow-lg'
              }`}
            >
              <div className="text-4xl mb-2">{language.flag}</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                {language.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                ({language.code.toUpperCase()})
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg mb-8">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          ℹ️ {t('languageSettings.aboutTitle')}
        </h4>
        <ul className="space-y-2 text-slate-600 dark:text-slate-300">
          <li className="flex items-start">
            <span className="text-blue-500 mr-3">•</span>
            <span>{t('languageSettings.info1')}</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3">•</span>
            <span>{t('languageSettings.info2')}</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3">•</span>
            <span>{t('languageSettings.info3')}</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-3">•</span>
            <span>{t('languageSettings.info4')}</span>
          </li>
        </ul>
      </div>

      {/* Language Statistics */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg p-6 text-center text-white">
        <p className="text-sm opacity-90 mb-1">
          {t('languageSettings.supporting')} <strong>{languages.length}</strong> {t('languageSettings.languages')}
        </p>
        <p className="text-3xl font-bold">🌍</p>
      </div>
    </PageWrapper>
  );
}
