import { useState } from 'react';
import Card from '../../components/common/Card.jsx';
import { Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your account preferences.</p>
      </div>

      <Card>
        <h2 className="text-base font-semibold text-ink-100">Password</h2>
        <form className="mt-4 flex flex-col gap-4">
          <div>
            <label className="label-text" htmlFor="currentPassword">Current Password</label>
            <input id="currentPassword" type="password" className="input-field" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label-text" htmlFor="newPassword">New Password</label>
              <input id="newPassword" type="password" className="input-field" placeholder="••••••••" />
            </div>
            <div>
              <label className="label-text" htmlFor="confirmNewPassword">Confirm New Password</label>
              <input id="confirmNewPassword" type="password" className="input-field" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="btn-secondary self-start">Update Password</button>
        </form>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-ink-100">Notifications</h2>
        <div className="mt-4 flex flex-col gap-4">
          <ToggleRow
            label="Email notifications"
            description="Get notified when an AI review finishes processing."
            checked={emailNotifs}
            onChange={setEmailNotifs}
          />
          <ToggleRow
            label="Weekly digest"
            description="A weekly summary of your portfolio score trends."
            checked={weeklyDigest}
            onChange={setWeeklyDigest}
          />
        </div>
      </Card>

      <Card className="border-accent-rose/30">
        <h2 className="text-base font-semibold text-accent-rose">Danger Zone</h2>
        <p className="mt-1 text-sm text-ink-500">
          Deleting your account removes all projects, reviews, and portfolio data permanently.
        </p>
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
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-accent-violet' : 'bg-base-700'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
