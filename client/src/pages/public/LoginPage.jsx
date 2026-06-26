import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GitBranch } from 'lucide-react';
import { loginSchema } from '../../utils/validationSchemas.js';
import { useLogin } from '../../hooks/useAuthMutations.js';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const serverError = error?.response?.data?.message || error?.message;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-950 px-4">
      <div className="absolute inset-x-0 top-0 -z-10 h-[500px] bg-aurora" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-md p-6 sm:p-8"
      >
        <Link to="/" className="flex items-center justify-center gap-2 font-display text-lg font-semibold text-ink-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-violet/15 text-accent-violet">
            <GitBranch size={18} />
          </span>
          AiCodeReviewer
        </Link>
        <h1 className="mt-6 text-center text-2xl font-bold text-ink-100">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-ink-500">Log in to view your dashboard.</p>

        <form onSubmit={handleSubmit((data) => login(data))} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="label-text" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" className="input-field"
              placeholder="adamya@example.com" {...register('email')} />
            {errors.email && <p className="mt-1.5 text-xs text-accent-rose">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label-text" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'}
                autoComplete="current-password" className="input-field pr-10"
                placeholder="••••••••" {...register('password')} />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-ink-500 hover:text-ink-100">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-accent-rose">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div className="rounded-lg border border-accent-rose/30 bg-accent-rose/10 px-3 py-2 text-sm text-accent-rose">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isPending} className="btn-primary mt-2 w-full py-2.5">
            {isPending ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-accent-violet hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
