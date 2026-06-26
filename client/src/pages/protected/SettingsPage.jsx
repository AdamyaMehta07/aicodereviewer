import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from '../../components/common/Card.jsx';
import { InlineError } from '../../components/common/Spinner.jsx';
import { useChangePassword } from '../../hooks/useAuthMutations.js';
import { Trash2 } from 'lucide-react';

const pwSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword:     z.string().min(8, 'At least 8 characters'),
  confirmNew:      z.string().min(1, 'Required'),
}).refine(d => d.newPassword === d.confirmNew, {
  message: "Passwords don't match", path: ['confirmNew'],
});

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const changePassword = useChangePassword();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(pwSchema),
  });

  const onSubmit = async (data) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPwSaved(true);
      reset();
      setTimeout(() => setPwSaved(false), 3000);
    } catch {}
  };

  const serverError = changePassword.error?.response?.data?.message;

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your account preferences.</p>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-ink-100">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="label-text">Current Password</label>
            <input type="password" className="input-field" placeholder="••••••••" {...register('currentPassword')} />
            {errors.currentPassword && <p className="mt-1.5 text-xs text-accent-rose">{errors.currentPassword.message}</p>}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text">New Password</label>
              <input type="password" className="input-field" placeholder="••••••••" {...register('newPassword')} />
              {errors.newPassword && <p className="mt-1.5 text-xs text-accent-rose">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="label-text">Confirm New Password</label>
              <input type="password" className="input-field" placeholder="••••••••" {...register('confirmNew')} />
              {errors.confirmNew && <p className="mt-1.5 text-xs text-accent-rose">{errors.confirmNew.message}</p>}
            </div>
          </div>
          {serverError && <InlineError message={serverError} />}
          <button type="submit" disabled={changePassword.isPending} className="btn-secondary self-start">
            {changePassword.isPending ? 'Updating...' : pwSaved ? '✓ Password Updated!' : 'Update Password'}
          </button>
        </form>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-ink-100">Notifications</h2>
        <div className="mt-4 flex flex-col gap-4">
          <ToggleRow label="Email notifications"
            description="Get notified when an AI review finishes."
            checked={emailNotifs} onChange={setEmailNotifs} />
          <ToggleRow label="Weekly digest"
            description="A weekly summary of your portfolio score trends."
            checked={weeklyDigest} onChange={setWeeklyDigest} />
        </div>
      </Card>

      <Card className="border-accent-rose/30">
        <h2 className="text-base font-semibold text-accent-rose">Danger Zone</h2>
        <p className="mt-1 text-sm text-ink-500">Deleting your account removes all projects, reviews, and portfolio data permanently.</p>
        <button className="btn-secondary mt-4 border-accent-rose/40 text-accent-rose hover:bg-accent-rose/10">
          <Trash2 size={16} /> Delete Account
        </button>
      </Card>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink-100">{label}</p>
        <p className="text-xs text-ink-500">{description}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent-violet' : 'bg-base-700'}`}
        aria-pressed={checked}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}
