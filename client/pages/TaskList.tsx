import React, { useState } from 'react';
import { Task, TaskType, UserRole } from '../types';
import { Button } from '../components/Button';
import { Clock, Globe, Filter, ChevronRight, Edit3, Image as ImageIcon, CheckCircle2, Camera, Trash2, Edit, BadgeCheck, Mic, FileAudio } from 'lucide-react';

interface TaskListProps {
  onSelectTask: (task: Task) => void;
  tasks: Task[];
  userRole?: UserRole;
  onDeleteTask?: (taskId: string) => void;
  completedTaskIds?: string[];
}

export const TaskList: React.FC<TaskListProps> = ({ onSelectTask, tasks, userRole = 'contributor', onDeleteTask, completedTaskIds = [] }) => {
  const [filterType, setFilterType] = useState<string>('All');

  const filteredTasks = tasks
    .filter(task => {
      const status = (task.status as string || '').trim().toUpperCase();
      return status === 'AVAILABLE' || status === 'ACTIVE';
    })
    .filter(task => filterType === 'All' ? true : task.type === filterType);

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.AUDIO_COLLECTION: return <Mic className="h-4 w-4" />;
      case TaskType.IMAGE_COLLECTION: return <Camera className="h-4 w-4" />;
      case TaskType.TEXT_ANNOTATION: return <Edit3 className="h-4 w-4" />;
      case TaskType.IMAGE_LABELING: return <ImageIcon className="h-4 w-4" />;
      case TaskType.SURVEY: return <CheckCircle2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColors = (type: TaskType) => {
    switch (type) {
      case TaskType.AUDIO_COLLECTION: return 'bg-blue-900/20 text-blue-300 border-blue-800/50';
      case TaskType.IMAGE_COLLECTION: return 'bg-pink-900/20 text-pink-300 border-pink-800/50';
      case TaskType.TEXT_ANNOTATION: return 'bg-violet-900/20 text-violet-300 border-violet-800/50';
      case TaskType.IMAGE_LABELING: return 'bg-purple-900/20 text-purple-300 border-purple-800/50';
      default: return 'bg-orange-900/20 text-orange-300 border-orange-800/50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {userRole === 'admin' ? 'Task Registry' : 'Active Projects'}
        </h1>
        <p className="text-zinc-500 text-base">
          {userRole === 'admin' ? 'Manage global task distribution and status.' : 'Select a task from available corporate campaigns.'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-wrap gap-1 overflow-x-auto no-scrollbar">
        {(['All', TaskType.AUDIO_COLLECTION, TaskType.IMAGE_COLLECTION, TaskType.TEXT_ANNOTATION, TaskType.IMAGE_LABELING, TaskType.SURVEY] as string[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap ${filterType === type
              ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg scale-[1.02]'
              : 'bg-transparent text-slate-500 dark:text-stone-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-white/5'
              }`}
          >
            {type === 'All' ? 'All Operations' : type}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isCompleted = completedTaskIds.includes(task.id);
            const MAX = 100;
            const used = task.submissionCount ?? 0;
            const remaining = MAX - used;
            const pct = Math.min((used / MAX) * 100, 100);
            const isLow = remaining <= 25;
            const isCritical = remaining <= 10;

            return (
              <div
                key={task.id}
                className={`group relative bg-white dark:bg-zinc-900 rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isCompleted
                    ? 'opacity-60 cursor-not-allowed border-slate-200 dark:border-white/10'
                    : userRole === 'contributor'
                      ? 'cursor-pointer border-slate-200 dark:border-white/10 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5'
                      : 'border-slate-200 dark:border-white/10'
                  }`}
                onClick={() => userRole === 'contributor' && !isCompleted && onSelectTask(task)}
              >
                <div className="flex flex-col md:flex-row">

                  {/* Left: Image panel (only if imageUrl exists) */}
                  {task.imageUrl && (
                    <div className="w-full md:w-56 h-44 md:h-auto bg-white/5 flex-shrink-0 relative overflow-hidden">
                      <img
                        src={task.imageUrl}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
                      {task.project && task.project !== 'NA' && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          {task.project}
                        </div>
                      )}
                      {isCompleted && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-white" />
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Submitted</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right: Content */}
                  <div className="flex-1 p-5 md:p-6 flex flex-col gap-3 min-w-0">

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getTypeColors(task.type as TaskType)}`}>
                        {getTaskIcon(task.type as TaskType)}
                        {task.type}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-stone-300 border border-slate-200 dark:border-white/10">
                        <Globe className="h-3 w-3" /> {task.language}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${task.difficulty === 'Beginner'
                        ? 'border-emerald-700/40 text-emerald-400 bg-emerald-900/10'
                        : task.difficulty === 'Intermediate'
                          ? 'border-amber-700/40 text-amber-400 bg-amber-900/10'
                          : 'border-red-700/40 text-red-400 bg-red-900/10'
                        }`}>
                        {task.difficulty}
                      </span>

                      {/* Submitted badge */}
                      {isCompleted && !task.imageUrl && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500 text-white ml-auto">
                          <BadgeCheck className="h-3.5 w-3.5" /> Submitted
                        </span>
                      )}

                      {/* Admin actions */}
                      {userRole === 'admin' && (
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/40 transition-colors"
                            title="Export Metadata (JSON)"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const { fetchApi } = await import('../lib/api');
                                const { API_ENDPOINTS } = await import('../config/api');
                                const res = await fetchApi(API_ENDPOINTS.EXPORT_METADATA(task.id));
                                if (res.ok) {
                                  const blob = await res.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `task_${task.id}_metadata.json`;
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  window.URL.revokeObjectURL(url);
                                } else {
                                  const errData = await res.json().catch(() => null);
                                  console.error('Export failed:', res.status, errData);
                                  alert(errData?.details || errData?.error || 'Export failed for this task.');
                                }
                              } catch (err) {
                                console.error('Export failed:', err);
                                alert('An error occurred during export.');
                              }
                            }}
                          >
                            <FileAudio className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-stone-400 transition-colors"
                            title="Edit task"
                            onClick={e => e.stopPropagation()}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-800/40 transition-colors"
                            title="Delete task"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this task?')) {
                                onDeleteTask?.(task.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Title — no clamp, always fully visible */}
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {task.title}
                      </h3>
                      {task.project && task.project !== 'NA' && !task.imageUrl && (
                        <p className="text-xs text-slate-500 dark:text-stone-400 mt-0.5 uppercase tracking-wider font-semibold">{task.project}</p>
                      )}
                    </div>

                    {/* Requirements (hide if NA or empty) */}
                    {task.requirements && task.requirements.length > 0 &&
                      task.requirements.some(r => r && r !== 'NA') && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-500 dark:text-stone-400 uppercase tracking-wide font-bold">Requires:</span>
                          {task.requirements.filter(r => r && r !== 'NA').map((req, i) => (
                            <span key={i} className="inline-flex items-center px-2 py-0.5 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-stone-300 rounded-md text-xs font-semibold">
                              {req}
                            </span>
                          ))}
                        </div>
                      )}

                    {/* Bottom row: time, payout, quota, CTA */}
                    <div className="flex items-center gap-3 mt-auto pt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-semibold text-slate-900 dark:text-white">
                        <Clock className="h-3.5 w-3.5 text-stone-400" />
                        {task.estimatedTimeSec} sec
                      </span>
                      <span className="inline-flex items-center text-base font-black text-blue-400 bg-blue-900/20 px-4 py-1.5 rounded-lg border border-blue-800/50">
                        ₹{task.compensation.toFixed(2)}
                      </span>

                      {/* Quota progress bar */}
                      {task.submissionCount !== undefined && (
                        <div className="flex-1 min-w-[120px] hidden md:block">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-stone-400'}`}>
                              {remaining} slot{remaining !== 1 ? 's' : ''} left
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">{used}/{MAX}</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Contributor CTA arrow */}
                      {userRole === 'contributor' && !isCompleted && (
                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden md:block">
                          <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <ChevronRight className="h-5 w-5 text-black" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
            <div className="h-20 w-20 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Filter className="h-10 w-10 text-slate-400 dark:text-stone-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No active campaigns</h3>
            <p className="text-stone-500 mt-2 text-base">Try adjusting your filters or come back later.</p>
            <Button variant="secondary" className="mt-6 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white border-slate-200 dark:border-white/10" onClick={() => setFilterType('All')}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
