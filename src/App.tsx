import { useState, useEffect, useRef } from 'react';
import { SurveyForm } from './components/SurveyForm';
import { AdminDashboard } from './components/AdminDashboard';
import { ClipboardList, BarChart3, Sun, Moon, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const ADMIN_PASSWORD = 'admin1215';

type ViewMode = 'survey' | 'admin';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('survey');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Admin auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (showPasswordModal) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showPasswordModal]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAdminTabClick = () => {
    if (isAdminAuthenticated) {
      setViewMode('admin');
    } else {
      setPasswordInput('');
      setPasswordError(false);
      setShowPassword(false);
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setShowPasswordModal(false);
      setViewMode('admin');
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setIsShaking(true);
      setPasswordInput('');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setViewMode('survey');
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-300">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'var(--glass-glow)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPasswordModal(false); }}
        >
          <div
            className={`glass-card max-w-sm w-full text-center ${isShaking ? 'animate-shake' : ''}`}
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(14,11,28,0.95)' : 'rgba(255,255,255,0.98)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Lock size={26} style={{ color: 'var(--primary)' }} />
              </div>
            </div>
            <h3 className="text-xl font-extrabold mb-1 text-slate-800" style={{ color: 'var(--text-primary)' }}>관리자 전용 페이지</h3>
            <p className="text-xs text-slate-400 mb-6">관리자 비밀번호를 입력해야 득표 현황을 확인할 수 있습니다.</p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  className="form-input text-center pr-12 font-mono text-base tracking-widest"
                  placeholder="비밀번호 입력"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  style={{
                    borderColor: passwordError ? 'var(--accent-rose)' : 'var(--glass-border)',
                    boxShadow: passwordError ? '0 0 0 4px var(--accent-rose-glow)' : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {passwordError && (
                <p className="text-xs font-bold text-rose-500" style={{ color: 'var(--accent-rose)' }}>
                  비밀번호가 올바르지 않습니다. 다시 확인해 주세요.
                </p>
              )}

              <button
                type="submit"
                disabled={passwordInput.length === 0}
                className="btn-premium w-full py-3"
              >
                <ShieldCheck size={18} />
                관리자 페이지 입장
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="btn-secondary w-full py-3 text-sm"
              >
                취소
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Shake keyframe injection */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .animate-shake { animation: shake 0.45s ease; }
      `}</style>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-900/10" style={{ borderColor: 'var(--glass-border)', backgroundColor: theme === 'dark' ? 'rgba(12, 8, 23, 0.7)' : 'rgba(245, 247, 255, 0.7)' }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 rounded-xl" style={{ backgroundColor: 'var(--glass-glow)' }}>
              <ClipboardList size={22} className="text-indigo-400" style={{ color: 'var(--primary)' }} />
            </div>
            <span className="font-extrabold text-lg tracking-tight" style={{
              backgroundImage: theme === 'dark' ? 'linear-gradient(to right, #ffffff, #a5b4fc)' : 'linear-gradient(to right, #1e1b4b, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              친절직원 추천 캠페인
            </span>
          </div>

          <div className="flex items-center gap-2">
            <nav className="flex bg-slate-950/40 p-1 rounded-xl border border-slate-900" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <button
                onClick={() => setViewMode('survey')}
                className={`px-4 py-1.5 text-xs rounded-lg transition-all ${
                  viewMode === 'survey' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{
                  backgroundColor: viewMode === 'survey' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'survey' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                직원 추천 투표
              </button>
              <button
                onClick={handleAdminTabClick}
                className={`px-4 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1 ${
                  viewMode === 'admin' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{
                  backgroundColor: viewMode === 'admin' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'admin' ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {isAdminAuthenticated ? <BarChart3 size={12} /> : <Lock size={12} />}
                득표 현황 (관리자)
              </button>
            </nav>

            {/* Admin logout button */}
            {isAdminAuthenticated && viewMode === 'admin' && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs rounded-lg border font-bold transition-all hover:bg-rose-500/10"
                style={{ borderColor: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)', background: 'transparent' }}
              >
                로그아웃
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-800/40 transition-all text-slate-400 hover:text-slate-200"
              style={{ borderColor: 'var(--glass-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-12 relative z-10">
        {viewMode === 'survey' ? (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <h1>이달의 친절직원 추천</h1>
              <p className="text-slate-400 text-sm">
                환자분들과 동료들에게 친절과 따뜻함으로 헌신해주신 직원을 추천해주세요. 귀하의 한 표가 더욱 행복한 직장 환경을 만듭니다.
              </p>
            </div>
            <SurveyForm onComplete={() => {}} onNavigateToAdmin={() => {
              if (isAdminAuthenticated) {
                setViewMode('admin');
              } else {
                setPasswordInput('');
                setPasswordError(false);
                setShowPassword(false);
                setShowPasswordModal(true);
              }
            }} />
          </div>
        ) : (
          <AdminDashboard onBackToSurvey={() => setViewMode('survey')} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900/10 text-center text-xs text-slate-500 mt-auto" style={{ borderColor: 'var(--glass-border)' }}>
        <p>© 2026 친절직원 추천 캠페인. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
