import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../core/context/AuthContext';
import ecarlogo from '../auth/aasets/ecar-logo.png'
import safiplogo from '../auth/aasets/safip.png';

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
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* LEFT SIDE - WHITE BACKGROUND */}
      <div className="relative w-full md:w-1/2 bg-white flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-12 overflow-y-auto">
        
        
        {/* First Logo */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 sm:h-32 sm:w-32 md:h-60 md:w-60">
            <img src={ecarlogo} alt={isArabic ? 'شعار ECAR' : 'ECAR Logo'} className="h-16 w-16 sm:h-24 sm:w-24 md:h-52 md:w-52 object-contain" />
          </div>
        </div>

        {/* Second Logo */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 sm:h-32 sm:w-32 md:h-60 md:w-60">
            <img src={safiplogo} alt={isArabic ? 'شعار SAFIP' : 'SAFIP Logo'} className="h-16 w-16 sm:h-24 sm:w-24 md:h-52 md:w-52 object-contain" />
          </div>
        </div>

        {/* Translatable Description Text */}
        <div className="w-11/12 md:w-3/4 text-center mb-12">
          {/* <p className="text-sm text-gray-700 leading-relaxed">
            {t('auth.companyDescription', 'This system is licensed and developed for managing intellectual property resources.')}
          </p> */}
            <p 
          className={`text-center mb-0 font-bold text-sm sm:text-sm md:text-base ${
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
      <div className="w-full md:w-1/2 bg-gradient-to-b from-sky-300 to-sky-400 flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-12 relative overflow-y-auto">

        {/* LOGIN FORM BOX */}
        <div className="w-full sm:w-11/12 md:w-3/4 lg:w-1/2 bg-black bg-opacity-95 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 mx-auto">
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

            {/* Branch Selection Buttons */}
            <div className="flex gap-2 rounded overflow-hidden shadow-lg">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-sky-400 text-white font-bold text-sm transition hover:bg-sky-500"
                >
                  {t('auth.firstBranch', 'First Branch')}
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-sky-400 text-white font-bold text-sm  transition hover:bg-sky-500"
                >
                  {t('auth.secondBranch', 'Second Branch')}
                </button>
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

            {/* Change Language Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 rounded overflow-hidden shadow-lg">
              <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={`flex-1 px-4 py-2 font-bold text-sm transition ${
                  i18n.language === 'en' ? 'bg-sky-400 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('ar')}
                className={`flex-1 px-4 py-2 font-bold text-sm border-l transition ${
                  i18n.language === 'ar' ? 'bg-sky-400 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
                }`}
              >
                عربي
              </button>
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
