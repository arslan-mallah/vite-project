import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';
import frTranslation from './locales/fr.json';
import deTranslation from './locales/de.json';
import itTranslation from './locales/it.json';
import ptTranslation from './locales/pt.json';
import ruTranslation from './locales/ru.json';
import jaTranslation from './locales/ja.json';
import koTranslation from './locales/ko.json';
import zhTranslation from './locales/zh.json';
import hiTranslation from './locales/hi.json';
import arTranslation from './locales/ar.json';
import urTranslation from './locales/ur.json';

const resources = {
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  de: { translation: deTranslation },
  it: { translation: itTranslation },
  pt: { translation: ptTranslation },
  ru: { translation: ruTranslation },
  ja: { translation: jaTranslation },
  ko: { translation: koTranslation },
  zh: { translation: zhTranslation },
  hi: { translation: hiTranslation },
  ar: { translation: arTranslation },
  ur: { translation: urTranslation },
};

// Inject auth translations programmatically so Login form updates immediately
const authTranslations: Record<string, Record<string, string>> = {
  en: {
    login: 'Welcome Back',
    loginSubtitle: 'Sign in to your account to continue',
    username: 'Username',
    usernamePlaceholder: 'Enter your username',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    clear: 'Clear',
    demoCredentials: 'Demo Credentials',
  },
  es: {
    login: 'Bienvenido de nuevo',
    loginSubtitle: 'Inicia sesión para continuar',
    username: 'Nombre de usuario',
    usernamePlaceholder: 'Ingrese su nombre de usuario',
    password: 'Contraseña',
    passwordPlaceholder: 'Ingrese su contraseña',
    signIn: 'Iniciar sesión',
    signingIn: 'Iniciando sesión...',
    clear: 'Borrar',
    demoCredentials: 'Credenciales de demostración',
  },
  fr: {
    login: 'Bon retour',
    loginSubtitle: "Connectez-vous pour continuer",
    username: "Nom d'utilisateur",
    usernamePlaceholder: "Entrez votre nom d'utilisateur",
    password: 'Mot de passe',
    passwordPlaceholder: 'Entrez votre mot de passe',
    signIn: 'Se connecter',
    signingIn: 'Connexion...',
    clear: 'Effacer',
    demoCredentials: 'Identifiants de démonstration',
  },
  de: {
    login: 'Willkommen zurück',
    loginSubtitle: 'Melden Sie sich an, um fortzufahren',
    username: 'Benutzername',
    usernamePlaceholder: 'Geben Sie Ihren Benutzernamen ein',
    password: 'Passwort',
    passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
    signIn: 'Anmelden',
    signingIn: 'Anmeldung...',
    clear: 'Löschen',
    demoCredentials: 'Demo-Zugangsdaten',
  },
  it: {
    login: 'Bentornato',
    loginSubtitle: 'Accedi per continuare',
    username: 'Nome utente',
    usernamePlaceholder: "Inserisci il tuo nome utente",
    password: 'Password',
    passwordPlaceholder: 'Inserisci la tua password',
    signIn: 'Accedi',
    signingIn: 'Accesso...',
    clear: 'Cancella',
    demoCredentials: 'Credenziali demo',
  },
  pt: {
    login: 'Bem-vindo de volta',
    loginSubtitle: 'Faça login para continuar',
    username: 'Nome de usuário',
    usernamePlaceholder: 'Digite seu nome de usuário',
    password: 'Senha',
    passwordPlaceholder: 'Digite sua senha',
    signIn: 'Entrar',
    signingIn: 'Entrando...',
    clear: 'Limpar',
    demoCredentials: 'Credenciais de demonstração',
  },
  ru: {
    login: 'С возвращением',
    loginSubtitle: 'Войдите, чтобы продолжить',
    username: 'Имя пользователя',
    usernamePlaceholder: 'Введите имя пользователя',
    password: 'Пароль',
    passwordPlaceholder: 'Введите пароль',
    signIn: 'Войти',
    signingIn: 'Вход...',
    clear: 'Очистить',
    demoCredentials: 'Демонстрационные учетные данные',
  },
  ja: {
    login: 'お帰りなさい',
    loginSubtitle: '続行するにはサインインしてください',
    username: 'ユーザー名',
    usernamePlaceholder: 'ユーザー名を入力してください',
    password: 'パスワード',
    passwordPlaceholder: 'パスワードを入力してください',
    signIn: 'サインイン',
    signingIn: 'サインイン中...',
    clear: 'クリア',
    demoCredentials: 'デモ資格情報',
  },
  ko: {
    login: '다시 오신 것을 환영합니다',
    loginSubtitle: '계정에 로그인하세요',
    username: '사용자 이름',
    usernamePlaceholder: '사용자 이름을 입력하세요',
    password: '비밀번호',
    passwordPlaceholder: '비밀번호를 입력하세요',
    signIn: '로그인',
    signingIn: '로그인 중...',
    clear: '지우기',
    demoCredentials: '데모 자격 증명',
  },
  zh: {
    login: '欢迎回来',
    loginSubtitle: '请登录以继续',
    username: '用户名',
    usernamePlaceholder: '输入您的用户名',
    password: '密码',
    passwordPlaceholder: '输入您的密码',
    signIn: '登录',
    signingIn: '正在登录...',
    clear: '清除',
    demoCredentials: '演示凭证',
  },
  hi: {
    login: 'वापसी पर स्वागत है',
    loginSubtitle: 'जारी रखने के लिए साइन इन करें',
    username: 'उपयोगकर्ता नाम',
    usernamePlaceholder: 'अपना उपयोगकर्ता नाम दर्ज करें',
    password: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    signIn: 'साइन इन',
    signingIn: 'साइन इन कर रहे हैं...',
    clear: 'साफ़ करें',
    demoCredentials: 'डेमो प्रमाण-पत्र',
  },
  ar: {
    login: 'مرحبا بعودتك',
    loginSubtitle: 'سجل الدخول للمتابعة',
    username: 'اسم المستخدم',
    usernamePlaceholder: 'أدخل اسم المستخدم',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    signIn: 'تسجيل الدخول',
    signingIn: 'جارٍ تسجيل الدخول...',
    clear: 'مسح',
    demoCredentials: 'بيانات اعتماد تجريبية',
  },
  ur: {
    login: 'واپسی پر خوش آمدید',
    loginSubtitle: 'جاری رکھنے کے لیے سائن ان کریں',
    username: 'صارف نام',
    usernamePlaceholder: 'اپنا صارف نام درج کریں',
    password: 'پاس ورڈ',
    passwordPlaceholder: 'اپنا پاس ورڈ درج کریں',
    signIn: 'سائن ان',
    signingIn: 'سائن ان کیا جا رہا ہے...',
    clear: 'صاف کریں',
    demoCredentials: 'ڈیمو اسناد',
  },
};

Object.keys(authTranslations).forEach((lng) => {
  if ((resources as any)[lng]) {
    // Ensure `auth` namespace exists and merge auth translations under it
    const target = (resources as any)[lng].translation;
    target.auth = Object.assign({}, target.auth || {}, authTranslations[lng]);
  }
});

// Ensure `shortcuts` keys exist in all languages (use English defaults as fallback)
const englishShortcuts = (enTranslation as any).shortcuts || {};
Object.keys(resources).forEach((lng) => {
  const target = (resources as any)[lng];
  if (target && target.translation) {
    // do not overwrite existing translations; let existing locale override English defaults
    target.translation.shortcuts = Object.assign({}, englishShortcuts, target.translation.shortcuts || {});
  }
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('appLanguage') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
