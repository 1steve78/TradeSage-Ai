import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loading, error, clearError } = useAuthStore();

  useEffect(() => {
    // Clear errors when mounting/unmounting
    clearError();
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
      {error && (
        <div className="p-sm text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="email">
          Email Address
        </label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="institutional@tradesage.com"
          className="input-precision w-full px-md py-sm border border-outline-variant rounded bg-surface-container-lowest font-body-md text-on-surface placeholder:text-outline transition-all" 
        />
      </div>

      <div className="flex flex-col gap-xs">
        <div className="flex justify-between items-center">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="password">
            Password
          </label>
          <a href="#" className="font-label-caps text-label-caps text-primary hover:underline transition-all">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            id="password" 
            name="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-precision w-full px-md py-sm border border-outline-variant rounded bg-surface-container-lowest font-body-md text-on-surface placeholder:text-outline transition-all" 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-primary text-on-primary font-title-sm text-title-sm py-sm rounded transition-all hover:bg-on-surface-variant active:scale-[0.98] flex items-center justify-center gap-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined animate-spin">progress_activity</span> 
            Authenticating...
          </>
        ) : (
          <>
            Log In
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  );
}