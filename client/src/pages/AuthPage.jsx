import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import useAuthStore from '../store/authStore';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-md">
      <main className="w-full max-w-[440px] flex flex-col gap-xl">
        
        {/* Logo & Header Section */}
        <header className="text-center flex flex-col items-center gap-sm">
          <Link to="/" className="flex items-center gap-xs mb-sm hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'wght' 700" }}>
              query_stats
            </span>
            <span className="font-title-sm text-title-sm font-extrabold tracking-tight text-on-surface">
              TRADESAGE AI
            </span>
          </Link>
          <h1 className="font-display-lg text-display-lg text-on-surface">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {isLogin ? 'Access your institutional trading terminal' : 'Set up your institutional trading terminal'}
          </p>
        </header>

        {/* Tab Switcher */}
        <div className="flex bg-surface-container rounded-lg p-xs gap-xs">
          <button 
            type="button" 
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-sm rounded font-title-sm text-body-sm font-semibold transition-all duration-150 ${isLogin ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant'}`}
          >
            Log In
          </button>
          <button 
            type="button" 
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-sm rounded font-title-sm text-body-sm font-semibold transition-all duration-150 ${!isLogin ? 'bg-white text-on-surface shadow-sm' : 'text-on-surface-variant'}`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Card Container */}
        <div className="login-card p-xl rounded-lg">
          
          {/* Form Routing */}
          {isLogin ? <LoginForm /> : <RegisterForm onRegisterSuccess={() => setIsLogin(true)} />}

          {/* Secondary Action */}
          <div className="mt-xl pt-lg border-t border-outline-variant text-center">
            {isLogin ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Don't have an account?{' '}
                <button type="button" onClick={() => setIsLogin(false)} className="text-primary font-semibold hover:underline cursor-pointer">
                  Sign up for TradeSage
                </button>
              </p>
            ) : (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Already have an account?{' '}
                <button type="button" onClick={() => setIsLogin(true)} className="text-primary font-semibold hover:underline cursor-pointer">
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Trust Indicator / Footer */}
        <footer className="flex flex-col items-center gap-sm opacity-60">
          <div className="flex items-center gap-xs font-label-caps text-label-caps text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            Protected by bank-grade AES-256 security
          </div>
          <div className="flex gap-md font-label-caps text-label-caps text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </footer>

      </main>
    </div>
  );
}