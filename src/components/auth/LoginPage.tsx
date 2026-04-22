import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, Smartphone, MessageSquare, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/i18n/LanguageContext';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';

type LoginMethod = 'email' | 'phone';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin, isLoading } = useAuth();
  const { t, currentLang, setLanguage, languages, currentLanguage } = useLanguage();
  const [method, setMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t('common.fillAllFields'));
      return;
    }
    try {
      await login(email, password);
      toast.success(t('common.loginSuccess'));
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || t('common.loginFailed'));
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !verifyCode) {
      toast.error(t('common.fillAllFields'));
      return;
    }
    try {
      toast.success(t('common.loginSuccess'));
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || t('common.loginFailed'));
    }
  };

  const handleSendVerifyCode = async () => {
    if (!phone) {
      toast.error(t('common.phoneRequired'));
      return;
    }
    setSendingCode(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('common.codeSent'));
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || t('common.sendFailed'));
    } finally {
      setSendingCode(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      await googleLogin(idToken);
      toast.success(t('common.googleSuccess'));
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || t('common.googleFailed'));
    }
  };

  const handleGoogleError = () => {
    toast.error(t('common.googleFailed'));
  };

  return (
    <div className="min-h-screen bg-[#05070B] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C5CFF]/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Language Switcher */}
        <div className="absolute top-0 right-0">
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-white/50 hover:text-white/70 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{currentLanguage.flag} {currentLanguage.nativeName}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#1a1a2e] border border-white/[0.1] shadow-xl max-h-80 overflow-y-auto z-50">
                <div className="p-2 space-y-0.5">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        currentLang === lang.code
                          ? 'bg-[#7C5CFF]/20 text-white'
                          : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="flex-1 text-left">{lang.nativeName}</span>
                      {currentLang === lang.code && (
                        <span className="text-[#7C5CFF] text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="h-7 w-7 text-[#7C5CFF]" />
            <span className="text-xl font-semibold tracking-tight">{t('brand')}</span>
          </div>
          <h1 className="text-2xl font-semibold mb-2">{t('login.title')}</h1>
          <p className="text-white/40">{t('login.subtitle')}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-sm">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            width="100%"
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 text-white/30 bg-[#05070B]">或使用以下方式登录</span>
            </div>
          </div>

          <div className="flex gap-2 mb-6 p-1 rounded-lg bg-white/[0.03]">
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-all ${
                method === 'email'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Mail className="h-4 w-4" />
              {t('login.emailTab')}
            </button>
            <button
              onClick={() => setMethod('phone')}
              className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-md text-sm font-medium transition-all ${
                method === 'phone'
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              {t('login.phoneTab')}
            </button>
          </div>

          {method === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-2">{t('login.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7C5CFF]/50 focus:ring-1 focus:ring-[#7C5CFF]/20 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-2">{t('login.password')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 pl-10 pr-10 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7C5CFF]/50 focus:ring-1 focus:ring-[#7C5CFF]/20 transition-all"
                    placeholder={t('login.password')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-white/[0.1] bg-white/[0.03] accent-[#7C5CFF]"
                  />
                  <span className="text-white/40">{t('login.rememberMe')}</span>
                </label>
                <a href="#" className="text-[#7C5CFF] hover:text-[#7C5CFF]/80 transition-colors">
                  {t('login.forgotPassword')}
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-white text-[#05070B] text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('login.submit') + '...' : t('login.submit')}
              </button>
            </form>
          )}

          {method === 'phone' && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-white/50 mb-2">{t('login.phone')}</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7C5CFF]/50 focus:ring-1 focus:ring-[#7C5CFF]/20 transition-all"
                    placeholder="+86 138 0000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-2">{t('login.verifyCode')}</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <input
                      type="text"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      maxLength={6}
                      className="w-full h-11 pl-10 pr-4 rounded-lg border border-white/[0.08] bg-white/[0.03] text-sm placeholder:text-white/20 focus:outline-none focus:border-[#7C5CFF]/50 focus:ring-1 focus:ring-[#7C5CFF]/20 transition-all"
                      placeholder={t('login.verifyCode')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendVerifyCode}
                    disabled={sendingCode || countdown > 0}
                    className="h-11 px-4 rounded-lg bg-[#7C5CFF]/20 text-[#7C5CFF] text-sm font-medium hover:bg-[#7C5CFF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}s` : t('login.sendCode')}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-white text-[#05070B] text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('login.submit') + '...' : t('login.submit')}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-white/40">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-white hover:text-white/80 transition-colors font-medium">
              {t('login.signUp')}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-white/20">
          {t('login.terms')}{' '}
          <a href="#" className="text-white/30 hover:text-white/50">{t('login.termsLink')}</a>
          {' '}{(currentLang === 'zh-CN' || currentLang === 'zh-TW') ? '和' : 'and'}{' '}
          <a href="#" className="text-white/30 hover:text-white/50">{t('login.privacyLink')}</a>
        </p>
      </div>
    </div>
  );
}
