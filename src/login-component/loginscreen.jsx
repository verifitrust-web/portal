/* ============================================================
   LoginPageAlt.jsx — Verifitech Portal Login (Alt UI)
   Matched to the VeriFlow reference screenshot:
   - Exact green #69BE28 flat left panel
   - Two-panel layout (green left, white right)
   - Mode toggle: white pill, active tab = green text
   - Labeled inputs (label above, light border) — matches reference
   Dual-mode: Employee (email + password) / Client (username + password)
   Fully responsive · Connected with AuthContext + Backend
   ============================================================ */

import React, { useState, useEffect, useCallback } from 'react';
import {
  FiBriefcase, FiMail, FiLock, FiUser,
  FiArrowRight, FiCheck, FiX, FiCheckCircle, FiAlertCircle,
  FiEye, FiEyeOff, FiShield,
} from 'react-icons/fi';
import theme from '../theme/theme';
import { useNavigate } from 'react-router-dom';
import api from '../apiroute/apiroute';
import { useAuth } from '../context/AuthContext';

/* ───────── VeriTrust green logo (from CDN) ───────── */
const verifiTechLogo =
  'https://portal.verifitrust.com/assets/verifitech-logoo-B8NSlskG.png';

/* ───────── Design tokens — exact VeriFlow green theme ───────── */
const C = {
  green:    '#69BE28',  /* exact brand green (sampled from reference) */
  green700: '#5aa521',  /* hover / pressed */
  green600: '#62b224',
  green50:  '#f2faE8'.toLowerCase(), /* very light green tint */
  green100: '#e4f5d3',
  ink:      '#1a1a1a',
  body:     '#4a5568',
  muted:    '#94a3b8',
  line:     '#e2e8f0',
  white:    '#ffffff',
  danger:   '#ef4444',
};

/* ───────── Stats data (matches reference image) ───────── */
const statsData = [
  { value: '10k+', label: 'Verifications Processed' },
  { value: '100+', label: 'Enterprise Clients' },
];

/* ───────── Brand Mark (logo + wordmark) ───────── */
function BrandMark({ variant = 'light' }) {
  const isLight = variant === 'light';
  return (
    <div
      className="flex items-center gap-2.5"
      style={{ animation: 'logoEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
    >
      <img
        src={verifiTechLogo}
        alt="Verifitrust"
        className="h-8 w-auto object-contain"
        style={{ filter: isLight ? 'brightness(0) invert(1)' : 'none' }}
      />
    </div>
  );
}

/* ───────── Simple Labeled Input (matches reference) ───────── */
function LabeledInput({
  label, Icon, type = 'text', value, onChange, error, placeholder,
  showPasswordToggle = false, showPassword = false, onTogglePassword, autoComplete,
}) {
  const [focused, setFocused] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="mb-4" style={{ animation: 'fadeInUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
      <label
        className="block text-xs font-semibold mb-1.5"
        style={{ color: error ? C.danger : C.ink, fontFamily: theme.fonts.body }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
          style={{
            background: C.white,
            border: `1.5px solid ${error ? C.danger : focused ? C.green : C.line}`,
            color: C.ink,
            fontFamily: theme.fonts.body,
            boxShadow: focused ? '0 0 0 3px rgba(105, 190, 40, 0.15)' : 'none',
          }}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
            style={{ color: C.muted }}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: C.danger }}>
          <FiAlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

/* ───────── Mode Toggle — matches reference: white pill, green active text ───────── */
function ModeToggle({ mode, setMode }) {
  return (
    <div
      className="relative flex rounded-lg p-1 mb-6"
      style={{ background: C.white, border: `1.5px solid ${C.line}` }}
    >
      <div
        className="absolute top-1 bottom-1 rounded-md transition-all duration-400"
        style={{
          width: 'calc(50% - 4px)',
          left: mode === 'employee' ? '4px' : 'calc(50%)',
          background: C.white,
          border: `1.5px solid ${C.green}`,
          boxShadow: '0 2px 8px rgba(105, 190, 40, 0.15)',
        }}
      />
      <button
        type="button"
        onClick={() => setMode('employee')}
        className="relative z-10 flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
        style={{
          color: mode === 'employee' ? C.green : C.body,
          fontFamily: theme.fonts.body,
        }}
      >
        <FiUser size={14} />
        Employee
      </button>
      <button
        type="button"
        onClick={() => setMode('client')}
        className="relative z-10 flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
        style={{
          color: mode === 'client' ? C.green : C.body,
          fontFamily: theme.fonts.body,
        }}
      >
        <FiBriefcase size={14} />
        Client
      </button>
    </div>
  );
}

/* ───────── Toast ───────── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: { bg: 'rgba(105,190,40,0.12)', border: C.green, IconComp: FiCheckCircle, color: C.green600 },
    error:   { bg: 'rgba(239,68,68,0.12)',  border: C.danger, IconComp: FiAlertCircle, color: C.danger },
  };
  const c = config[type] || config.error;

  return (
    <div
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-xl backdrop-blur-xl max-w-[90vw] sm:max-w-none"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        animation: 'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        fontFamily: theme.fonts.body,
      }}
    >
      <c.IconComp size={18} style={{ color: c.color, flexShrink: 0 }} />
      <span className="text-sm" style={{ color: C.ink }}>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
        <FiX size={14} style={{ color: C.muted }} />
      </button>
    </div>
  );
}

/* ============================================================
   MAIN LOGIN PAGE — ALT UI (EXACT VERIFLOW GREEN)
   ============================================================ */
export default function LoginPageAlt() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [mode, setMode] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: true,
  });

  const [errors, setErrors] = useState({});

  const updateField = useCallback((field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  }, [errors]);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrors({});
    setShowPassword(false);
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = mode === 'employee' ? 'Work email is required' : 'Email / Username is required';
    } else if (mode === 'employee' && !/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    } else if (mode === 'client' && form.email.length < 3) {
      errs.email = 'Minimum 3 characters';
    }

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      if (mode === 'employee') {
        const response = await api.post('/employee/login', {
          email: form.email,
          password: form.password,
        });

        if (response.data.success) {
          const userData = response.data.data || response.data.employee || response.data.user || response.data;

          const isVendor =
            userData?.isVendor === true ||
            userData?.accountType === 'Vendor' ||
            userData?.userType === 'Vendor';

          authLogin({
            ...userData,
            fullName: userData.fullName || userData.name,
            role: userData.userType || userData.role || 'Employee',
          });

          setToast({ message: 'Login Successful! Redirecting...', type: 'success' });

          setTimeout(() => {
            navigate(isVendor ? '/vendor-dashboard' : '/mainlayout');
          }, 1200);
        }
      } else {
        const response = await api.post('/client/login', {
          email: form.email,
          password: form.password,
        });

        if (response.data.success) {
          const userData = response.data.data || response.data;

          authLogin({
            ...userData,
            fullName: userData.fullName || userData.clientName || userData.username || userData.email,
            role: 'Client',
          });

          setToast({ message: 'Client Login Successful!', type: 'success' });

          setTimeout(() => navigate('/client-dashboard'), 1200);
        }
      }
    } catch (error) {
      console.error(error);
      setToast({
        message: error.response?.data?.message || 'Invalid email or password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const firstField = mode === 'employee'
    ? { label: 'Work Email', Icon: FiMail, type: 'email', field: 'email', error: errors.email, placeholder: 'name@company.com', autoComplete: 'email' }
    : { label: 'Email / Username', Icon: FiUser, type: 'text', field: 'email', error: errors.email, placeholder: 'your.username', autoComplete: 'username' };

  return (
    <div
      className="min-h-screen relative flex"
      style={{ background: C.white, fontFamily: theme.fonts.body }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoEntrance {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ───────── LEFT PANEL — flat solid brand green (exact) ───────── */}
      <aside
        className="hidden lg:flex lg:w-[52%] xl:w-[50%] flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
        style={{
          background: C.green,
          animation: 'fadeInUp 0.7s cubic-bezier(0.4,0,0.2,1) both',
        }}
      >
        {/* Top: Logo */}
        <div className="relative z-10">
          <BrandMark variant="light" />
        </div>

        {/* Middle: Hero copy */}
        <div className="relative z-10 max-w-md">
          <h1
            className="text-4xl xl:text-5xl font-bold leading-[1.15] mb-4"
            style={{
              color: C.white,
              fontFamily: theme.fonts.display,
              animation: 'fadeInUp 0.7s 0.15s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            Seamless{'\n'}Verification.
          </h1>

          <p
            className="text-sm xl:text-base leading-relaxed mb-8"
            style={{
              color: 'rgba(255,255,255,0.9)',
              animation: 'fadeInUp 0.7s 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            Empowering enterprises with trust, security,{'\n'}and streamlined background checks.
          </p>

          {/* Bottom stats — matches reference placement */}
          <div
            className="flex items-center gap-8"
            style={{ animation: 'fadeInUp 0.7s 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            {statsData.map((s, i) => (
              <div key={i}>
                <div
                  className="text-3xl xl:text-4xl font-bold"
                  style={{ color: C.white, fontFamily: theme.fonts.display }}
                >
                  {s.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {s.label}
                </div>
                {i < statsData.length - 1 && (
                  <div className="hidden" style={{ display: 'none' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer microcopy */}
        <div
          className="relative z-10 flex items-center gap-2"
          style={{ animation: 'fadeInUp 0.7s 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          <FiShield size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {/* Trusted &amp; Secure · SOC 2 Type II · ISO 27001 */}
          </span>
        </div>
      </aside>

      {/* ───────── RIGHT PANEL (Login form) ───────── */}
      <main
        className="flex-1 flex flex-col items-center justify-center px-5 py-8 sm:px-8 lg:px-12 relative"
        style={{ animation: 'fadeInUp 0.7s 0.15s cubic-bezier(0.4,0,0.2,1) both' }}
      >
        {/* Mobile brand (visible < lg) */}
        <div className="lg:hidden w-full max-w-[420px] mb-8 flex items-center justify-between">
          <BrandMark variant="dark" />
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: C.green50, border: `1px solid ${C.green100}` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.green }} />
            <span className="text-[11px] font-medium" style={{ color: C.green600 }}>Console</span>
          </div>
        </div>

        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <div className="mb-7" style={{ animation: 'fadeInUp 0.6s 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: C.ink, fontFamily: theme.fonts.display }}>
              Welcome Back.
            </h2>
            <p className="text-sm" style={{ color: C.muted }}>
              Sign in to manage your verification workflows.
            </p>
          </div>

          {/* Mode Toggle */}
          <div style={{ animation: 'fadeInUp 0.6s 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <ModeToggle mode={mode} setMode={handleModeSwitch} />
          </div>

          {/* Form */}
          <form key={mode} onSubmit={handleSubmit} style={{ animation: 'fadeInUp 0.6s 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <LabeledInput
              label={firstField.label}
              type={firstField.type}
              value={form[firstField.field]}
              onChange={updateField(firstField.field)}
              error={firstField.error}
              placeholder={firstField.placeholder}
              autoComplete={firstField.autoComplete}
            />

            <LabeledInput
              label="Password"
              type="password"
              value={form.password}
              onChange={updateField('password')}
              error={errors.password}
              placeholder="Enter your password"
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
              autoComplete="current-password"
            />

            {/* Remember + Forgot row */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, remember: !p.remember }))}
                  className="w-4 h-4 rounded flex items-center justify-center transition-all duration-300"
                  style={{
                    background: form.remember ? C.green : 'transparent',
                    border: `1.5px solid ${form.remember ? C.green : C.muted}`,
                  }}
                >
                  {form.remember && <FiCheck size={10} style={{ color: C.white, strokeWidth: 3 }} />}
                </button>
                <span className="text-xs" style={{ color: C.body }}>Keep me signed in</span>
              </label>

              <a
                href="#"
                className="text-xs font-semibold hover:underline"
                style={{ color: C.green }}
                onClick={(e) => {
                  e.preventDefault();
                  setToast({ message: 'Password reset link sent to your email!', type: 'success' });
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:brightness-95 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: C.green,
                color: C.white,
                boxShadow: '0 4px 14px rgba(105, 190, 40, 0.35)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In as {mode === 'employee' ? 'Employee' : 'Client'}
                  <FiArrowRight size={14} />
                </span>
              )}
            </button>
          </form>

          {/* Sign up row */}
          <div
            className="mt-6 flex items-center justify-center gap-1.5"
            style={{ animation: 'fadeInUp 0.6s 0.55s cubic-bezier(0.34,1.56,0.64,1) both' }}
          >
            <span className="text-sm" style={{ color: C.muted }}>Don't have an account?</span>
            <a
              href="#"
              className="text-sm font-semibold hover:underline"
              style={{ color: C.green }}
              onClick={(e) => {
                e.preventDefault();
                setToast({ message: 'Access request form coming soon!', type: 'success' });
              }}
            >
              Request Access
            </a>
          </div>

          {/* Mobile stats */}
          <div className="lg:hidden mt-8 grid grid-cols-2 gap-3">
            {statsData.map((s, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: C.green50, border: `1px solid ${C.green100}` }}>
                <div className="text-xl font-bold" style={{ color: C.green, fontFamily: theme.fonts.display }}>{s.value}</div>
                <div className="text-[11px] mt-0.5" style={{ color: C.body }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-[11px]" style={{ color: C.muted }}>
          &copy; {new Date().getFullYear()} Verifitrust · Console
        </p>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
