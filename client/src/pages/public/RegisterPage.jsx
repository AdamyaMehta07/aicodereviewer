import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, GitBranch } from 'lucide-react';
import { registerSchema } from '../../utils/validationSchemas.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      // Phase 2 will replace this with: await apiClient.post('/auth/register', data)
      await new Promise((r) => setTimeout(r, 600));
      login({ name: data.name, email: data.email }, 'demo-token');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError('Could not create account. Please try again.');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-950 px-4 py-10">
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

        <h1 className="mt-6 text-center text-2xl font-bold text-ink-100">Create your account</h1>
        <p className="mt-1 text-center text-sm text-ink-500">Start reviewing your projects in minutes.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="label-text" htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="input-field"
              placeholder="Adamya Mehta"
              {...register('name')}
            />
            {errors.name && <p className="mt-1.5 text-xs text-accent-rose">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label-text" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input-field"
              placeholder="adamya@example.com"
              {...register('email')}
            />
            {errors.email && <p className="mt-1.5 text-xs text-accent-rose">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label-text" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="input-field pr-10"
                placeholder="At least 8 characters"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-ink-500 hover:text-ink-100"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-accent-rose">{errors.password.message}</p>}
          </div>

          <div>
            <label className="label-text" htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="input-field"
              placeholder="Repeat your password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-accent-rose">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-lg border border-accent-rose/30 bg-accent-rose/10 px-3 py-2 text-sm text-accent-rose">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full py-2.5">
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent-violet hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
