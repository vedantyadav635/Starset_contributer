import React, { useState } from 'react';
import { Task, TaskType, TaskStatus, UserRole } from '../types';
import { Button } from '../components/Button';
import { Clock, Globe, Filter, ChevronRight, Play, Edit3, Image as ImageIcon, CheckCircle2, Server, Camera, Briefcase, Zap, AlertCircle, Trash2, Edit } from 'lucide-react';

interface TaskListProps {
  onSelectTask: (task: Task) => void;
  tasks: Task[];
  userRole?: UserRole;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onSelectTask, tasks, userRole = 'contributor', onDeleteTask }) => {
  const [filterType, setFilterType] = useState<string>('All');

  const filteredTasks = tasks
    .filter(task => task.status === "AVAILABLE")
    .filter(task =>
      filterType === "All" ? true : task.type === filterType
    );


  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.AUDIO_COLLECTION: return <Play className="h-6 w-6 text-[#0f766e] fill-current" />;
      case TaskType.IMAGE_COLLECTION: return <Camera className="h-6 w-6 text-pink-600" />;
      case TaskType.TEXT_ANNOTATION: return <Edit3 className="h-6 w-6 text-blue-600" />;
      case TaskType.IMAGE_LABELING: return <ImageIcon className="h-6 w-6 text-purple-600" />;
      case TaskType.SURVEY: return <CheckCircle2 className="h-6 w-6 text-orange-600" />;
      default: return <Clock className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#121212] dark:text-white tracking-tight">
            {userRole === 'admin' ? 'Task Registry' : 'Active Projects'}
          </h1>
          <p className="text-stone-500 mt-1 text-lg">
            {userRole === 'admin' ? 'Manage global task distribution and status.' : 'Select a task from available corporate campaigns.'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white/5 p-2 rounded-xl border border-stone-200 dark:border-white/10 shadow-sm inline-flex flex-wrap gap-1">
        {['All', TaskType.AUDIO_COLLECTION, TaskType.IMAGE_COLLECTION, TaskType.TEXT_ANNOTATION, TaskType.IMAGE_LABELING, TaskType.SURVEY].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${filterType === type
                ? 'bg-[#121212] dark:bg-white text-white dark:text-black shadow-md'
                : 'bg-transparent text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/10'
              }`}
          >
            {type === 'All' ? 'All Operations' : type}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group bg-white dark:bg-white/5 rounded-2xl border border-stone-200 dark:border-white/10 p-0 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row h-full md:h-52 ${userRole === 'contributor' ? 'cursor-pointer hover:border-[#0f766e] dark:hover:border-blue-500 hover:shadow-lg hover:shadow-teal-900/5' : ''}`}
              onClick={() => userRole === 'contributor' && onSelectTask(task)}
            >
              {/* Task Image */}
              {task.imageUrl && (
                <div className="w-full md:w-64 h-48 md:h-full bg-stone-100 dark:bg-white/5 flex-shrink-0 relative overflow-hidden">
                  <img
                    src={task.imageUrl}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/5 dark:bg-black/40 group-hover:bg-transparent transition-colors"></div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                      {getTaskIcon(task.type)}
                    </div>
                  </div>

                  {/* Project Badge on Image */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {task.project}
                  </div>
                </div>
              )}

              {userRole === 'contributor' && (
                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300 z-10 hidden md:block">
                  <Button className="rounded-full h-12 w-12 p-0 flex items-center justify-center bg-stone-900 dark:bg-white hover:bg-black dark:hover:bg-stone-200 border-none shadow-xl">
                    <ChevronRight className="h-6 w-6 text-white dark:text-black" />
                  </Button>
                </div>
              )}

              <div className="flex-1 p-6 md:p-6 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border 
                    ${task.type === TaskType.AUDIO_COLLECTION ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-100 dark:border-teal-800' :
                      task.type === TaskType.IMAGE_COLLECTION ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border-pink-100 dark:border-pink-800' :
                        task.type === TaskType.TEXT_ANNOTATION ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800' :
                          task.type === TaskType.IMAGE_LABELING ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800' :
                            'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800'
                    }`}>
                    {task.type}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-white/5">
                    <Globe className="h-3 w-3 mr-1.5" /> {task.language}
                  </span>

                  {/* Difficulty Badge */}
                  <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border
                    ${task.difficulty === 'Beginner' ? 'border-green-200 text-green-600 dark:text-green-400' :
                      task.difficulty === 'Intermediate' ? 'border-yellow-200 text-yellow-600 dark:text-yellow-400' :
                        'border-red-200 text-red-600 dark:text-red-400'}`}>
                    {task.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#121212] dark:text-white mb-2 group-hover:text-[#0f766e] dark:group-hover:text-blue-400 transition-colors line-clamp-1">{task.title}</h3>

                {/* AI Capability & Requirements */}
                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-mono uppercase tracking-wide flex items-center">
                    <Server className="h-3 w-3 mr-1.5" /> {task.aiCapability}
                  </p>
                  {task.requirements && (
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 mr-0.5" /> Requires:
                      {task.requirements.map((req, i) => (
                        <span key={i} className="text-stone-700 dark:text-stone-300 font-medium">{req}{i < (task.requirements?.length || 0) - 1 ? ', ' : ''}</span>
                      ))}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-8 text-sm text-stone-500 mt-auto">
                  <span className="flex items-center bg-[#FAF9F7] dark:bg-white/5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-white/10">
                    <Clock className="h-4 w-4 mr-2 text-stone-400" /> <span className="font-medium text-[#121212] dark:text-white">{task.estimatedTimeMin} min</span>
                  </span>
                  <span className="flex items-center text-lg font-bold text-[#0f766e] dark:text-emerald-400 bg-teal-50 dark:bg-emerald-900/20 px-4 py-1.5 rounded-lg border border-teal-100 dark:border-emerald-800">
                    ₹{task.compensation.toFixed(2)}
                  </span>

                  {/* Admin Actions */}
                  {userRole === 'admin' && (
                    <div className="ml-auto flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full bg-stone-100 dark:bg-white/10 border-stone-200 hover:border-stone-300 text-stone-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this task?")) {
                            onDeleteTask?.(task.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-stone-300 dark:border-white/10">
            <div className="h-20 w-20 bg-stone-50 dark:bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Filter className="h-10 w-10 text-stone-400" />
            </div>
            <h3 className="text-xl font-bold text-[#121212] dark:text-white">No active campaigns</h3>
            <p className="text-stone-500 mt-2 text-lg">Try adjusting your filters or come back later.</p>
            <Button variant="secondary" className="mt-6 bg-white dark:bg-white/5 text-zinc-900 dark:text-white border-zinc-200 dark:border-white/10" onClick={() => setFilterType('All')}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};