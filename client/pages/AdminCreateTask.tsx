import React, { useState } from 'react';
import { Save, Plus, Trash2, Info, CheckCircle2 } from 'lucide-react';

import { Button } from '../components/Button';
import { Task, TaskType } from '../types';
import { API_ENDPOINTS } from '../config/api';
import { Waveform } from '../components/Waveform';

interface AdminCreateTaskProps {
  onSave: (task: Task) => void;
}

const LANGUAGES = ['English', 'Hindi', 'Hinglish', 'Bengali', 'Punjabi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];

export const AdminCreateTask: React.FC<AdminCreateTaskProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: TaskType.AUDIO_COLLECTION,
    compensation: 100,
    estimatedTimeSec: 20,
    language: 'English',
    project: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Expert',
    prompt: '',
    instructions: '',
    aiCapability: '',
    dataUsage: '',
    imageUrl: '',
    requirementsString: '',
    subtasks: [] as { title: string; prompt: string }[],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPlaylist = formData.type === TaskType.PLAYLIST;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const newTask = {
      title: formData.title,
      type: formData.type,
      compensation: formData.compensation,
      currency: 'INR',
      estimated_time_min: formData.estimatedTimeSec,
      status: 'AVAILABLE',
      language: formData.language,
      project: formData.project,
      difficulty: formData.difficulty,
      prompt: isPlaylist ? JSON.stringify(formData.subtasks) : formData.prompt,
      instructions: formData.instructions,
      ai_capability: formData.aiCapability,
      data_usage: formData.dataUsage,
      image_url: formData.imageUrl || null,
      requirements: formData.requirementsString
        ? formData.requirementsString.split(',').map((r) => r.trim())
        : [],
    };

    try {
      const { fetchApi } = await import('../lib/api');
      const response = await fetchApi(API_ENDPOINTS.ADMIN_TASKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to save the task');
      }

      const createdTask = await response.json();
      onSave(createdTask);
    } catch (err: any) {
      console.error('Task creation error:', err);
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const set = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* ── Header ── */}
      <header className="border-b border-line pb-6">
        <p className="t-meta">Console</p>
        <h1 className="t-h2 mt-1.5">Publish a collection</h1>
        <p className="mt-2 max-w-2xl text-sm text-body">
          What you define here is exactly what contributors see: the prompt they read, the
          requirements they must meet, and the compensation they are shown before starting.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft px-4 py-3 text-sm text-[color:var(--danger)]"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ── Identity ── */}
        <section className="panel">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Identity</h2>
            <span className="t-meta">Shown on the task card</span>
          </div>

          <div className="panel-body grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="task-title">Task title</label>
              <input
                id="task-title"
                className="field"
                required
                placeholder="e.g. Voice command — set an alarm"
                value={formData.title}
                onChange={(e) => set('title', e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="task-type">Task type</label>
              <select
                id="task-type"
                className="field"
                value={formData.type}
                onChange={(e) => set('type', e.target.value as TaskType)}
              >
                {Object.values(TaskType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="task-project">Project / campaign</label>
              <input
                id="task-project"
                className="field"
                required
                placeholder="e.g. Project Echo"
                value={formData.project}
                onChange={(e) => set('project', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── Parameters ── */}
        <section className="panel">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Collection parameters</h2>
            <span className="t-meta">Enforced by the platform</span>
          </div>

          <div className="panel-body grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="field-label" htmlFor="task-comp">Compensation (₹)</label>
              <input
                id="task-comp"
                type="number"
                inputMode="decimal"
                className="field font-mono"
                required
                min={0}
                step="0.01"
                value={formData.compensation}
                onChange={(e) => set('compensation', Number(e.target.value))}
              />
              <p className="field-hint">Paid per accepted submission.</p>
            </div>

            <div>
              <label className="field-label" htmlFor="task-time">Estimated time (seconds)</label>
              <input
                id="task-time"
                type="number"
                inputMode="numeric"
                className="field font-mono"
                required
                min={1}
                value={formData.estimatedTimeSec}
                onChange={(e) => set('estimatedTimeSec', Number(e.target.value))}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="task-language">Language</label>
              <select
                id="task-language"
                className="field"
                value={formData.language}
                onChange={(e) => set('language', e.target.value)}
              >
                {LANGUAGES.map((language) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="task-difficulty">Difficulty</label>
              <select
                id="task-difficulty"
                className="field"
                value={formData.difficulty}
                onChange={(e) => set('difficulty', e.target.value as typeof formData.difficulty)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="task-requirements">Requirements</label>
              <input
                id="task-requirements"
                className="field"
                placeholder="Headphones, quiet room, native speaker"
                value={formData.requirementsString}
                onChange={(e) => set('requirementsString', e.target.value)}
              />
              <p className="field-hint">Comma separated. Shown as chips on the task card.</p>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="panel">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">
              {isPlaylist ? 'Playlist steps' : 'Prompt and instructions'}
            </h2>
            {isPlaylist && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => set('subtasks', [...formData.subtasks, { title: '', prompt: '' }])}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                Add step
              </Button>
            )}
          </div>

          <div className="panel-body space-y-5">
            {isPlaylist ? (
              <>
                {formData.subtasks.length === 0 ? (
                  <div className="rounded-md border border-dashed border-line-strong px-6 py-10 text-center">
                    <p className="text-sm text-body">No steps yet. Add the first one to build the playlist.</p>
                  </div>
                ) : (
                  <ol className="grid gap-3">
                    {formData.subtasks.map((subtask, index) => (
                      <li key={index} className="rounded-md border border-line bg-paper-sunk p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="t-meta">Step {String(index + 1).padStart(2, '0')}</span>
                          <button
                            type="button"
                            aria-label={`Remove step ${index + 1}`}
                            onClick={() => {
                              const next = [...formData.subtasks];
                              next.splice(index, 1);
                              set('subtasks', next);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-danger-soft hover:text-[color:var(--danger)]"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                          </button>
                        </div>

                        <input
                          className="field"
                          required
                          placeholder="Step title"
                          aria-label={`Step ${index + 1} title`}
                          value={subtask.title}
                          onChange={(e) => {
                            const next = [...formData.subtasks];
                            next[index] = { ...next[index], title: e.target.value };
                            set('subtasks', next);
                          }}
                        />
                        <textarea
                          className="field mt-3 min-h-[4.5rem]"
                          required
                          rows={2}
                          placeholder="What should the contributor say or do in this step?"
                          aria-label={`Step ${index + 1} prompt`}
                          value={subtask.prompt}
                          onChange={(e) => {
                            const next = [...formData.subtasks];
                            next[index] = { ...next[index], prompt: e.target.value };
                            set('subtasks', next);
                          }}
                        />
                      </li>
                    ))}
                  </ol>
                )}
              </>
            ) : (
              <div>
                <label className="field-label" htmlFor="task-prompt">Prompt / script</label>
                <textarea
                  id="task-prompt"
                  className="field min-h-[5.5rem]"
                  required
                  rows={3}
                  placeholder="The exact text the contributor reads or responds to."
                  value={formData.prompt}
                  onChange={(e) => set('prompt', e.target.value)}
                />
                <p className="field-hint">Reviewers judge submissions against this text.</p>
              </div>
            )}

            <div>
              <label className="field-label" htmlFor="task-instructions">Instructions</label>
              <textarea
                id="task-instructions"
                className="field min-h-[7rem]"
                required
                rows={4}
                placeholder="Step-by-step guidance, including the quality bar for this collection."
                value={formData.instructions}
                onChange={(e) => set('instructions', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── Transparency ── */}
        <section className="panel">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Consent disclosure</h2>
            <span className="t-meta">Shown before recording</span>
          </div>

          <div className="panel-body space-y-5">
            <div className="flex items-start gap-2.5 rounded-md border border-line bg-paper-sunk p-3.5">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-none text-muted" strokeWidth={1.75} aria-hidden="true" />
              <p className="text-xs text-body">
                These two fields appear verbatim on the contributor&rsquo;s consent screen. Be
                specific — vague wording is not meaningful consent.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="task-capability">AI capability</label>
                <input
                  id="task-capability"
                  className="field"
                  required
                  placeholder="e.g. Hindi speech recognition"
                  value={formData.aiCapability}
                  onChange={(e) => set('aiCapability', e.target.value)}
                />
              </div>

              <div>
                <label className="field-label" htmlFor="task-usage">Data usage scope</label>
                <input
                  id="task-usage"
                  className="field"
                  required
                  placeholder="e.g. Internal model training only"
                  value={formData.dataUsage}
                  onChange={(e) => set('dataUsage', e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="task-image">Context image URL</label>
                <input
                  id="task-image"
                  type="url"
                  className="field font-mono text-xs"
                  placeholder="https://…"
                  value={formData.imageUrl}
                  onChange={(e) => set('imageUrl', e.target.value)}
                />
                <p className="field-hint">Optional. Shown alongside the task.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Preview ── */}
        <section className="panel overflow-hidden">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Card preview</h2>
            <span className="t-meta">What contributors see</span>
          </div>

          <div className="panel-body">
            <div className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-signal">{formData.type}</span>
                <span className="tag">{formData.language}</span>
                <span className="tag">{formData.difficulty}</span>
              </div>
              <h3 className="t-h4 mt-3">{formData.title || 'Untitled collection'}</h3>
              {formData.project && <p className="t-meta mt-1">{formData.project}</p>}

              <div className="mt-4 max-w-sm">
                <Waveform seed={formData.title || 'preview'} bars={44} height={18} color="var(--line-strong)" />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6 border-t border-line-faint pt-4">
                <div>
                  <p className="t-meta">Compensation</p>
                  <p className="mt-0.5 font-display text-lg font-semibold text-ink tnum">
                    ₹{Number(formData.compensation || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="t-meta">Est. time</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{formData.estimatedTimeSec} sec</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Actions ── */}
        <div className="flex flex-col-reverse items-center gap-3 pb-4 sm:flex-row sm:justify-end">
          <p className="flex items-center gap-1.5 text-xs text-muted sm:mr-auto">
            <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Published tasks go live immediately, capped at 100 submissions.
          </p>
          <Button type="submit" size="lg" isLoading={isLoading} className="w-full sm:w-auto">
            {!isLoading && <Save className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
            {isLoading ? 'Publishing…' : 'Publish collection'}
          </Button>
        </div>
      </form>
    </div>
  );
};
