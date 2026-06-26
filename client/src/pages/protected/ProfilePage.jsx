import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '../../components/common/Card.jsx';
import { InlineError } from '../../components/common/Spinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUpdateProfile } from '../../hooks/useAuthMutations.js';
import { useState } from 'react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  bio: z.string().max(280, 'Keep your bio under 280 characters').optional(),
  role: z.string().min(1, 'Select a role'),
});

export default function ProfilePage() {
  const { user, login, token } = useAuth();
  const updateProfile = useUpdateProfile();
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name:  user?.name  || 'Adamya Mehta',
      email: user?.email || 'adamya@example.com',
      bio:   user?.bio   || '',
      role:  user?.role  || 'user',
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await updateProfile.mutateAsync(data);
      login(res.data.data.user, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  };

  const serverError = updateProfile.error?.response?.data?.message;

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Profile</h1>
        <p className="mt-1 text-sm text-ink-500">This information appears on your public portfolio.</p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-violet/20 text-xl font-semibold text-accent-violet">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div>
            <p className="text-sm font-medium text-ink-100">{user?.name || 'Adamya Mehta'}</p>
            <p className="text-xs text-ink-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="label-text" htmlFor="name">Full Name</label>
              <input id="name" className="input-field" {...register('name')} />
              {errors.name && <p className="mt-1.5 text-xs text-accent-rose">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label-text" htmlFor="email">Email</label>
              <input id="email" type="email" className="input-field" {...register('email')} />
              {errors.email && <p className="mt-1.5 text-xs text-accent-rose">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="label-text" htmlFor="bio">Bio</label>
            <textarea id="bio" rows={3} className="input-field resize-none"
              placeholder="Tell recruiters a bit about yourself..." {...register('bio')} />
            {errors.bio && <p className="mt-1.5 text-xs text-accent-rose">{errors.bio.message}</p>}
          </div>

          {serverError && <InlineError message={serverError} />}

          <button type="submit" disabled={updateProfile.isPending} className="btn-primary self-start px-6">
            {updateProfile.isPending ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </form>
      </Card>
    </div>
  );
}
