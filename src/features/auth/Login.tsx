import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../core/context/AuthContext";
import ecarlogo from '../auth/aasets/ecar-logo.png'
import safiplogo from '../auth/aasets/safip.png';


export default function Login() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError(t('auth.loginErrorEmpty', 'Please enter both username and password'));
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || t('auth.loginFailed', 'Login failed'));
    }
  };

  const changeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
  }, [i18n]);

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
  }, [i18n, changeLanguage]);

  return (
    <div className="min-h-sceen flex flex-col-reverse md:flex-row bg-white" dir={isArabic ? "rtl" : "ltr"}>
      <div className="w-full min-h-screen md:w-1/2 bg-white gap-2 flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-12 overflow-y-auto">
        {/* First Logo */}
        <div className="mb-2 text-center">
          <div className="inline-flex items-center justify-center">
            <img src={ecarlogo} alt={isArabic ? 'شعار ECAR' : 'ECAR Logo'} className="object-contain" />
          </div>
        </div>
        {/* Second Logo */}
        <div className="mb-2 text-center">
          <div className="inline-flex items-center justify-center">
            <img src={safiplogo} alt={isArabic ? 'شعار SAFIP' : 'SAFIP Logo'} className="h-16 w-16 sm:h-24 sm:w-24 md:h-52 md:w-52 object-contain" />
          </div>
        </div>
        <div className="w-11/12 md:w-3/4 text-center mb-12">
          {/* <p className="text-sm text-gray-700 leading-relaxed">
            {t('auth.companyDescription', 'This system is licensed and developed for managing intellectual property resources.')}
          </p> */}
          <p
            className={`text-center mb-0 font-bold text-sm sm:text-sm md:text-base ${isArabic
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
      <div className="text-white w-full min-h-screen md:w-1/2 bg-primary-light flex flex-col items-center justify-center px-6 md:px-12 py-8 md:py-12 overflow-y-auto">
        {/* LOGIN FORM BOX */}
        <div className="w-full sm:11/12 md:3/4 lg:w-3/4 bg-blackBox-dark bg-opacity-95 rounded-md shadow-md p-2 sm:p-3 md:p-4 mx-auto">
          <h1 className="text-white text-lg font-bold text-center mb-8">{t('auth.login', 'Login')}</h1>
          <form onSubmit={handleSubmit} className="space-y-2">
            { /* USERNAME FIELD */}
            <label className="text-white text-xs font-bold block mb-1">{t('auth.user.username')}</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 text-black text-sm rounded focus:outline-none focus:ring-2 focus:primary-dark"
              placeholder={t('auth.user.username')}
              aria-required
            />
            { /* PASSWORD FIELD */}
            <label className="text-white text-xs font-bold block mb-1 mt-4">{t('auth.user.password')}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="relative w-full px-4 py-2 text-black text-sm rounded focus:outline-none focus:ring-2 focus:primary-dark"
                placeholder={t('auth.user.password')}>
              </input>
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-[1000] p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zM10 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4.03 3.97a.75.75 0 10-1.06 1.06l1.664 1.664C3.68 7.11 1.73 10 1 10c.73 2.89 4 7 9 7 1.73 0 3.29-.55 4.6-1.5l2.37 2.37a.75.75 0 101.06-1.06L4.03 3.97zM10 15c-2.76 0-5-2.24-5-5 0-.77.14-1.5.39-2.18l1.5 1.5a3 3 0 004.29 4.29l1.5 1.5c-.68.25-1.41.39-2.18.39zm3.87-2.18l-1.5-1.5a3 3 0 00-4.29-4.29l-1.5-1.5c.68-.25 1.41-.39 2.18-.39 2.76 0 5 2.24 5 5 0 .77-.14 1.5-.39 2.18z" />
                  </svg>
                )}
              </span>
            </div>
            {/* Branch Selection Buttons */}
            <div className="flex gap-2 rounded overflow-hidden shadow-lg">
              <button
                type="button" className="flex-1 px-4 py-2 bg-primary text-white font-bold text-sm transition hover:bg-primary-dark">
                {t('branches.branch1', 'Branch 1')}
              </button>
              <button
                type="button" className="flex-1 px-4 py-2 bg-primary text-white font-bold text-sm transition hover:bg-primary-dark">
                {t('branches.branch2', 'Branch 2')}
              </button>
            </div>

            {/* Year Select */}
            <div>
              <label htmlFor="year" className="sr-only">Year</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2 bg-white text-black text-sm rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
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
                className={`flex-1 px-4 py-2 font-bold text-sm transition ${i18n.language === 'en' ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => changeLanguage('ar')}
                className={`flex-1 px-4 py-2 font-bold text-sm border-l transition ${i18n.language === 'ar' ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
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
              className="w-full py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-500 text-white font-bold rounded transition duration-200"
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
        </div>
        <div className="w-full sm:11/12 md:3/4 lg:w-3/4 p-2 sm:p-3 md:p-4 mx-auto">
          <p className="text-white text-center text-xs mt-4">{t('version')}: {t('auth.version')}</p>
        </div>
        <footer className="w-full fixed bottom-0 left-0 right-0 bg-black px-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center text-white text-xs py-2">
            <p className="py-1 md:py-0 text-center md:text-left">
              &copy; 2006-2025 Samcotec. All rights reserved.
            </p>
            <p className="py-1 md:py-0 text-center md:text-right">
              {t('support.technicalSupport')}: {t('support.contact1')} - {t('support.contact2')}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );

}