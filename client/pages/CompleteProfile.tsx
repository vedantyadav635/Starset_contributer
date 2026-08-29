import React, { useState } from 'react';
import { ArrowRight, CalendarDays, Users, MapPin, Smartphone, Lock } from 'lucide-react';

import { supabase } from '../supabaseClient';
import { Button } from '../components/Button';
import { Waveform } from '../components/Waveform';

interface CompleteProfileProps {
  onComplete: () => void;
}

/**
 * One-time profile completion. Two groups: who is speaking (which is what
 * makes a collection representative) and where compensation should go.
 */
const CompleteProfile: React.FC<CompleteProfileProps> = ({ onComplete }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!age || !gender || !city || !state || !upiId) {
      setError('Please fill in every field.');
      return;
    }

    if (Number(age) < 18 || Number(age) > 100) {
      setError('Age must be between 18 and 100.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (!user || userError) {
        console.error('User error:', userError);
        setError('Your session was not found. Please sign in again.');
        setLoading(false);
        return;
      }

      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
          age: Number(age),
          gender,
          city,
          state,
          upi_id: upiId,
          profile_completed: true,
        })
        .eq('id', user.id)
        .select();

      setLoading(false);

      if (updateError) {
        console.error('Update error:', updateError);
        setError(updateError.message);
        return;
      }

      if (!updateData || updateData.length === 0) {
        setError('Could not update your profile — no matching record was found.');
        return;
      }

      onComplete();
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl py-4">
      {/* Header */}
      <header className="mb-8">
        <p className="t-meta">Step 1 of 1</p>
        <h1 className="t-h2 mt-2">Complete your profile</h1>
        <p className="mt-3 max-w-xl text-body">
          Two things before you can pick up tasks: enough about you for a collection to be
          representative, and where your compensation should go.
        </p>
        <div className="mt-6">
          <Waveform seed="complete-profile" bars={80} height={22} color="var(--line-strong)" />
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-md border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft px-3.5 py-3 text-sm text-[color:var(--danger)]"
          >
            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-[var(--danger)]" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* ── Speaker profile ── */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2 className="text-sm font-semibold text-ink">Speaker profile</h2>
              <p className="mt-0.5 text-xs text-muted">
                Used to match you to collections. Never attached to the audio itself.
              </p>
            </div>
          </div>

          <div className="panel-body grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="profile-age">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                  Age
                </span>
              </label>
              <input
                id="profile-age"
                type="number"
                inputMode="numeric"
                className="field"
                placeholder="e.g. 24"
                min={18}
                max={100}
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <p className="field-hint">You must be 18 or over to contribute.</p>
            </div>

            <div>
              <label className="field-label" htmlFor="profile-gender">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                  Gender
                </span>
              </label>
              <select
                id="profile-gender"
                className="field"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="profile-city">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                  City
                </span>
              </label>
              <input
                id="profile-city"
                className="field"
                placeholder="e.g. Pune"
                required
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="profile-state">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                  State
                </span>
              </label>
              <input
                id="profile-state"
                className="field"
                placeholder="e.g. Maharashtra"
                required
                autoComplete="address-level1"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <p className="field-hint">Region helps match you to dialect-specific collections.</p>
            </div>
          </div>
        </section>

        {/* ── Payout ── */}
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2 className="text-sm font-semibold text-ink">Payout details</h2>
              <p className="mt-0.5 text-xs text-muted">Where accepted work settles.</p>
            </div>
          </div>

          <div className="panel-body">
            <label className="field-label" htmlFor="profile-upi">
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                UPI ID
              </span>
            </label>
            <input
              id="profile-upi"
              className="field font-mono"
              placeholder="yourname@upi"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
            <p className="field-hint">
              Double-check this — it is the account accepted submissions settle to. You can change
              it later from your profile.
            </p>
          </div>
        </section>

        <div className="flex flex-col-reverse items-center gap-4 pt-2 sm:flex-row sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Used for matching and payment only.
          </p>
          <Button type="submit" size="lg" isLoading={loading} className="w-full sm:w-auto">
            {loading ? 'Saving…' : 'Save and continue'}
            {!loading && <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompleteProfile;
