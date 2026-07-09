import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

export default function RegisterForm({ onRegisterSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, loading, error, clearError } = useAuthStore();

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    clearError();
    setSuccessMsg('');
    
    try {
      await register({ name, email, password });
      // If we didn't throw an error, registration was successful!
      // (Wait, we should check if authStore sets an error. If there is an error in store after call, it failed.
      // Since register is async, let's wait for it to finish and check if error is set in the store.)
      
      // Let's get the fresh error state after register finishes
      const currentError = useAuthStore.getState().error;
      if (!currentError) {
        setSuccessMsg('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          if (onRegisterSuccess) onRegisterSuccess();
        }, 1500);
      }
    } catch {
      // Handled by the store
    }
  };

  return (
    <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
      {error && (
        <div className="p-sm text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {error}
        </div>
      )}
      
      {successMsg && (
        <div className="p-sm text-sm text-green-600 bg-green-50 border border-green-200 rounded">
          {successMsg}
        </div>
      )}

      <div className="flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="fullname">
          Full Name
        </label>
        <input 
          type="text" 
          id="fullname" 
          name="fullname" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="input-precision w-full px-md py-sm border border-outline-variant rounded bg-surface-container-lowest font-body-md text-on-surface placeholder:text-outline transition-all" 
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="regEmail">
          Email Address
        </label>
        <input 
          type="email" 
          id="regEmail" 
          name="regEmail" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="institutional@tradesage.com"
          className="input-precision w-full px-md py-sm border border-outline-variant rounded bg-surface-container-lowest font-body-md text-on-surface placeholder:text-outline transition-all" 
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="regPassword">
          Password
        </label>
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            id="regPassword" 
            name="regPassword" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
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
            Creating account...
          </>
        ) : (
          <>
            Create Account
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  );
}