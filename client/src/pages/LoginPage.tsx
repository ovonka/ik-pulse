import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ActivityIcon, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../app/store/authStore';
import { useToastStore } from '../app/store/toastStore';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useSupportDebugStore } from '../app/store/supportDebugStore';

type RedirectState = {
  from?: {
    pathname?: string;
  };
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const showToast = useToastStore((state) => state.showToast);
  const consumeSupportCode = useSupportDebugStore((state) => state.consumeSupportCode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [supportCode, setSupportCode] = useState('');

  const state = location.state as RedirectState | null;
  const redirectPath = state?.from?.pathname ?? '/dashboard';

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    try {
      const user = await login({ email, password });

      if (
        supportCode.trim() &&
        ['admin', 'support', 'qa'].includes(user.role)
      ) {
        await consumeSupportCode(supportCode.trim());

        showToast({
          type: 'success',
          title: 'Support session started',
          message: 'Merchant debug context loaded successfully.',
        });
      } else {
        showToast({
          type: 'success',
          title: 'Login successful',
          message: `Welcome back, ${user.email}`,
        });
      }

      navigate(redirectPath, { replace: true });
    } catch {
      showToast({
        type: 'error',
        title: 'Login failed',
        message: 'Please check your email and password and try again.',
      });
    }
  }

  const isSubmitting = status === 'loading';

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background: `
    radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.59), transparent 52%),
    radial-gradient(circle at bottom center, rgba(0, 0, 0, 0.18), transparent 45%),
    var(--bg)
  `,
      }}
    >
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <ActivityIcon size={28} />
          </div>

          <h1 className="text-5xl font-bold" style={{ color: 'var(--text)' }}>
            Welcome to iK Pulse
          </h1>

          <p className="mt-3 text-base" style={{ color: 'var(--text-muted)' }}>
            Sign in to access your merchant dashboard
          </p>
        </div>

        <div
          className="border px-8 py-8 shadow-lg"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Email Address
              </label>

              <div
                className="flex items-center gap-3 border px-4 py-3"
                style={{
                  backgroundColor: 'var(--surface-muted)',
                  borderColor: 'transparent',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="merchant@example.com"
                  className="w-full bg-transparent outline-none"
                  style={{ color: 'var(--text)' }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
                style={{ color: 'var(--text)' }}
              >
                Password
              </label>

              <div
                className="flex items-center gap-3 border px-4 py-3"
                style={{
                  backgroundColor: 'var(--surface-muted)',
                  borderColor: 'transparent',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <Lock size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none"
                  style={{ color: 'var(--text)' }}
                />
              </div>
              <div>
  <label
    htmlFor="support-code"
    className="mb-2 block text-sm font-semibold"
    style={{ color: 'var(--text)' }}
  >
    Support Access Code <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
  </label>

  <div
    className="flex items-center gap-3 border px-4 py-3"
    style={{
      backgroundColor: 'var(--surface-muted)',
      borderColor: 'transparent',
      borderRadius: 'var(--radius-md)',
    }}
  >
    <ShieldCheck size={18} style={{ color: 'var(--text-muted)' }} />
    <input
      id="support-code"
      type="text"
      value={supportCode}
      onChange={(event) => setSupportCode(event.target.value.toUpperCase())}
      placeholder="Enter support code if debugging a merchant account"
      className="w-full bg-transparent outline-none"
      style={{ color: 'var(--text)' }}
    />
  </div>
</div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <label
                className="inline-flex cursor-pointer items-center gap-2 text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-sm font-medium"
                style={{ color: 'var(--primary)' }}
              >
                Forgot password?
              </button>
            </div>

            {error ? (
              <div
                className="border px-4 py-3 text-sm"
                style={{
                  backgroundColor: 'var(--danger-soft)',
                  borderColor: 'var(--danger)',
                  color: 'var(--danger)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer px-4 py-3 text-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div
            className="mt-8 border-t pt-6 text-center text-sm"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <p className="mb-3">Demo credentials</p>

            <div
              className="rounded-xl px-4 py-4"
              style={{ backgroundColor: 'var(--surface-muted)' }}
            >
              <p>Email: kurt.muller@ikpulse.co.za</p>
              <p>Password: Password123!</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          © 2026 iK Pulse. Secure merchant platform.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;