import React, { useMemo, useState } from 'react';
import {
  Clock,
  Globe,
  ChevronRight,
  Mic,
  Camera,
  PenLine,
  Tags,
  ListChecks,
  ListMusic,
  CheckCircle2,
  Trash2,
  FileJson,
  SearchX,
} from 'lucide-react';

import { Task, TaskType, UserRole } from '../types';
import { Button } from '../components/Button';
import { Waveform } from '../components/Waveform';
import { cn } from '../lib/utils';

interface TaskListProps {
  onSelectTask: (task: Task) => void;
  tasks: Task[];
  userRole?: UserRole;
  onDeleteTask?: (taskId: string) => void;
  completedTaskIds?: string[];
}

const SUBMISSION_CAP = 100;

const TYPE_ICON: Record<string, typeof Mic> = {
  [TaskType.AUDIO_COLLECTION]: Mic,
  [TaskType.IMAGE_COLLECTION]: Camera,
  [TaskType.TEXT_ANNOTATION]: PenLine,
  [TaskType.IMAGE_LABELING]: Tags,
  [TaskType.SURVEY]: ListChecks,
  [TaskType.PLAYLIST]: ListMusic,
};

const FILTERS: string[] = [
  'All',
  TaskType.AUDIO_COLLECTION,
  TaskType.PLAYLIST,
  TaskType.IMAGE_COLLECTION,
  TaskType.TEXT_ANNOTATION,
  TaskType.IMAGE_LABELING,
  TaskType.SURVEY,
];

const difficultyTone = (difficulty: Task['difficulty']) => {
  if (difficulty === 'Beginner') return 'tag-ok';
  if (difficulty === 'Intermediate') return 'tag-warn';
  return 'tag-danger';
};

export const TaskList: React.FC<TaskListProps> = ({
  onSelectTask,
  tasks,
  userRole = 'contributor',
  onDeleteTask,
  completedTaskIds = [],
}) => {
  const [filterType, setFilterType] = useState<string>('All');
  const isAdmin = userRole === 'admin';

  const availableTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const status = String(task.status ?? '').trim().toUpperCase();
        return status === 'AVAILABLE' || status === 'ACTIVE';
      }),
    [tasks],
  );

  const filteredTasks = useMemo(
    () => (filterType === 'All' ? availableTasks : availableTasks.filter((t) => t.type === filterType)),
    [availableTasks, filterType],
  );

  const countFor = (type: string) =>
    type === 'All' ? availableTasks.length : availableTasks.filter((t) => t.type === type).length;

  const exportMetadata = async (taskId: string) => {
    try {
      const { fetchApi } = await import('../lib/api');
      const { API_ENDPOINTS } = await import('../config/api');
      const res = await fetchApi(API_ENDPOINTS.EXPORT_METADATA(taskId));

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error('Export failed:', res.status, errData);
        alert(errData?.details || errData?.error || 'Export failed for this task.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `task_${taskId}_metadata.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('An error occurred during export.');
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="t-meta">{isAdmin ? 'Registry' : 'Open collections'}</p>
          <h1 className="t-h2 mt-1.5">{isAdmin ? 'Task registry' : 'Available tasks'}</h1>
          <p className="mt-2 max-w-xl text-sm text-body">
            {isAdmin
              ? 'Every live collection, with its submission count against the cap.'
              : 'Rate and estimated time are shown before you open a task. Only accepted submissions are compensated.'}
          </p>
        </div>
      </header>

      {/* ── Filters ── */}
      <div className="scroll-x no-scrollbar -mx-1 px-1">
        <div className="segmented w-max" role="group" aria-label="Filter by task type">
          {FILTERS.map((type) => (
            <button
              key={type}
              type="button"
              data-active={filterType === type}
              aria-pressed={filterType === type}
              onClick={() => setFilterType(type)}
            >
              {type === 'All' ? 'All' : type}
              <span className="ml-1.5 text-muted tnum">{countFor(type)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      {filteredTasks.length > 0 ? (
        <ul className="grid gap-3">
          {filteredTasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);
            const used = task.submissionCount ?? 0;
            const remaining = Math.max(0, SUBMISSION_CAP - used);
            const pct = Math.min((used / SUBMISSION_CAP) * 100, 100);
            const critical = remaining <= 10;
            const low = remaining <= 25;
            const Icon = TYPE_ICON[task.type] ?? Mic;
            const clickable = !isAdmin && !isCompleted;

            return (
              <li key={task.id}>
                <article
                  className={cn(
                    'card relative overflow-hidden',
                    clickable && 'card-interactive cursor-pointer',
                    isCompleted && 'opacity-70',
                  )}
                  onClick={clickable ? () => onSelectTask(task) : undefined}
                >
                  <div className="flex flex-col gap-0 md:flex-row">
                    {/* Context image */}
                    {task.imageUrl && (
                      <div className="relative h-36 w-full flex-none overflow-hidden border-b border-line bg-paper-sunk md:h-auto md:w-48 md:border-b-0 md:border-r">
                        <img
                          src={task.imageUrl}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 p-5">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="tag tag-signal">
                          <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                          {task.type}
                        </span>
                        <span className="tag">
                          <Globe className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                          {task.language}
                        </span>
                        <span className={cn('tag', difficultyTone(task.difficulty))}>
                          {task.difficulty}
                        </span>

                        {isCompleted && (
                          <span className="tag tag-ok">
                            <CheckCircle2 className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                            Submitted
                          </span>
                        )}

                        {/* Admin actions */}
                        {isAdmin && (
                          <span className="ml-auto flex items-center gap-1.5">
                            <button
                              type="button"
                              title="Export metadata (JSON)"
                              aria-label="Export task metadata as JSON"
                              onClick={(e) => { e.stopPropagation(); exportMetadata(task.id); }}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
                            >
                              <FileJson className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              title="Delete task"
                              aria-label="Delete this task"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this task? Contributors will no longer see it.')) {
                                  onDeleteTask?.(task.id);
                                }
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-[color-mix(in_srgb,var(--danger)_40%,transparent)] hover:text-[color:var(--danger)]"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                            </button>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="t-h4 mt-3">{task.title}</h2>
                      {task.project && task.project !== 'NA' && (
                        <p className="t-meta mt-1">{task.project}</p>
                      )}

                      {/* Requirements */}
                      {task.requirements?.some((r) => r && r !== 'NA') && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className="t-meta">Requires</span>
                          {task.requirements
                            .filter((r) => r && r !== 'NA')
                            .map((req) => (
                              <span key={req} className="tag">{req}</span>
                            ))}
                        </div>
                      )}

                      {/* Audio hint */}
                      {task.type === TaskType.AUDIO_COLLECTION && (
                        <div className="mt-4 max-w-sm">
                          <Waveform seed={task.id} bars={44} height={18} color="var(--line-strong)" />
                        </div>
                      )}

                      {/* Footer row */}
                      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line-faint pt-4">
                        <div>
                          <p className="t-meta">Compensation</p>
                          <p className="mt-0.5 font-display text-lg font-semibold text-ink tnum">
                            ₹{task.compensation.toFixed(2)}
                          </p>
                        </div>

                        <div>
                          <p className="t-meta">Est. time</p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-ink">
                            <Clock className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                            {task.estimatedTimeSec} sec
                          </p>
                        </div>

                        {task.submissionCount !== undefined && (
                          <div className="min-w-[9rem] flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="t-meta">
                                {remaining} slot{remaining === 1 ? '' : 's'} left
                              </span>
                              <span className="t-meta tnum">{used}/{SUBMISSION_CAP}</span>
                            </div>
                            <div
                              className={cn('meter mt-2', critical ? 'meter-danger' : low ? 'meter-warn' : 'meter-ok')}
                              role="progressbar"
                              aria-valuenow={used}
                              aria-valuemin={0}
                              aria-valuemax={SUBMISSION_CAP}
                              aria-label="Submissions against cap"
                            >
                              <span style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )}

                        {clickable && (
                          <Button
                            size="sm"
                            className="ml-auto"
                            onClick={(e) => { e.stopPropagation(); onSelectTask(task); }}
                          >
                            Start
                            <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="card flex flex-col items-center gap-4 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper-sunk text-muted">
            <SearchX className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <div>
            <h2 className="t-h4">
              {filterType === 'All' ? 'No open collections right now' : `No open ${filterType.toLowerCase()} tasks`}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-body">
              {filterType === 'All'
                ? 'New collections are published as they are commissioned. Check back shortly.'
                : 'Try another task type — other collections may still be open.'}
            </p>
          </div>
          {filterType !== 'All' && (
            <Button variant="secondary" onClick={() => setFilterType('All')}>
              Show all tasks
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
