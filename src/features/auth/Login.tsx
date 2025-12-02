import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../core/context/AuthContext';

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const isArabic = i18n.language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError(t('auth.loginErrorEmpty', 'Please enter both username and password'));
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || t('auth.loginFailed', 'Login failed'));
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'ur'];
        const cur = (i18n?.language || 'en').split('-')[0];
        const idx = languages.indexOf(cur);
        const next = languages[(idx + 1) % languages.length];
        changeLanguage(next);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [i18n]);

  return (
    <div className="h-screen flex overflow-x-hidden bg-white">
      {/* LEFT SIDE - WHITE BACKGROUND */}
      <div className="relative w-1/2 bg-white flex flex-col items-center justify-center px-12 py-12 overflow-y-auto">
        {/* Language Selector - Top Left on White Side */}
        <div className="absolute top-6 left-6">
          <div className="flex gap-0 bg-white rounded overflow-hidden shadow-lg">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-6 py-2 font-bold text-sm transition ${
                i18n.language === 'en' ? 'bg-sky-400 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('ar')}
              className={`px-6 py-2 font-bold text-sm border-l transition ${
                i18n.language === 'ar' ? 'bg-sky-400 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              عربي
            </button>
          </div>
        </div>
        
        {/* First Logo - ACEP */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🏛️</span>
          </div>
        </div>

        {/* Second Logo - Shield */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🛡️</span>
          </div>
        </div>

        {/* Translatable Description Text */}
        <div className="w-3/4 text-center mb-16">
          {/* <p className="text-sm text-gray-700 leading-relaxed">
            {t('auth.companyDescription', 'This system is licensed and developed for managing intellectual property resources.')}
          </p> */}
            <p 
          className={`text-center mb-0 font-bold text-sm ${
    isArabic 
      ? 'text-right' 
      : 'text-left'
  }`}
>
  {isArabic ? 
    <span className="font-extrabold text-red-600">تحذيـر: </span>
    : 
    <span className="font-extrabold text-red-600">Warning: </span>
  }
 <span className="text-gray-600">
  {isArabic ? 
    <>
      {'يمنع إعادة إنتاج البرنامج وملحقاته بشكل كامـل أو تقليـده دون زيـادة أو نقصان أو أجراء أي تعديل عليه هذا المنتج تملكة شركة سام لتقنية المعلومات المحدوده – الرياض بموجب العلامه التجارية SAMCOTEC'} 
      <br />
      {'باعتماد الهيئة السعودية للملكية الفكرية برقم: 1435022395 وتاريخ 05-01-1436'}
    </>
    : 
    <>
      {'It is prohibited to reproduce or imitate the program and its annexes, in whole, without addition or reduction, or to make any modification to it. This product is owned by SAM Information Technology Co. Ltd. – Riyadh under the trademark SAMCOTEC,'} 
      <br />
      {'with the approval of the Saudi Authority for Intellectual Property, bearing registration number: 1435022395 and dated 05-01-1436.'}
    </>
  }
</span>
</p>
        </div>
      </div>

      {/* RIGHT SIDE - BLUE BACKGROUND */}
      <div className="w-1/2 bg-gradient-to-b from-sky-300 to-sky-400 flex flex-col items-center justify-center px-12 py-12 relative overflow-y-auto">

        {/* LOGIN FORM BOX */}
        <div className="w-1/2 bg-black bg-opacity-95 rounded-xl shadow-2xl p-8">
          {/* Form Title */}
          <h1 className="text-white text-lg font-bold text-center mb-8">{t('auth.login', 'Login')}</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="text-white text-xs font-bold block mb-2">
                {isArabic ? 'اسم الدخول' : 'Username'}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white text-black text-sm rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="100"
                aria-required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-white text-xs font-bold block mb-2">
                {isArabic ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white text-black text-sm rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
                placeholder="······"
                aria-required
              />
            </div>

            {/* Year Select */}
            <div>
              <label htmlFor="year" className="sr-only">Year</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 bg-white text-black text-sm rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" className="p-3 bg-red-500 bg-opacity-30 border border-red-400 rounded text-red-200 text-xs">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-sky-400 hover:bg-sky-500 disabled:bg-gray-500 text-white font-bold rounded transition duration-200"
            >
              {isLoading ? (
                <>
                  {isArabic ? 'جاري تسجيل الدخول...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isArabic ? 'تسجيل دخول' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Version Info Inside Form */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">{t('auth.version', 'SAMCOTEC v ERP - 3.4.01')}</p>
          </div>
        </div>

        {/* Technical Support Section - Below Form */}
        <div className="mt-12 text-center w-3/4">
          <p className="text-white text-sm font-bold mb-4">{t('auth.technicalSupport', 'For Technical Support')}</p>
          <div className="bg-white rounded-lg px-6 py-4 shadow-lg">
            <p className="text-gray-800 text-sm font-bold">
              {t('auth.contact1', '0112297553')} - {t('auth.contact2', '0565100268')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
