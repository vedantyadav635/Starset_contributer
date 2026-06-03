import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Task, TaskType, TaskStatus } from '../types';
import { Save, AlertCircle, Sparkles } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';


interface AdminCreateTaskProps {
  onSave: (task: Task) => void;
}

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
    requirementsString: '' // Temp field for parsing
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const newTask = {
      title: formData.title,
      type: formData.type,
      compensation: formData.compensation,
      currency: "INR",
      estimated_time_min: formData.estimatedTimeSec,
      status: "AVAILABLE",
      language: formData.language,
      project: formData.project,
      difficulty: formData.difficulty,
      prompt: formData.prompt,
      instructions: formData.instructions,
      ai_capability: formData.aiCapability,
      data_usage: formData.dataUsage,
      image_url: formData.imageUrl || null,
      requirements: formData.requirementsString
        ? formData.requirementsString.split(",").map(r => r.trim())
        : [],
    };

    try {
      const { fetchApi } = await import('../lib/api');
      // Use backend API (service role key — bypasses RLS on tasks table)
      const response = await fetchApi(API_ENDPOINTS.ADMIN_TASKS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Failed to save task');
      }

      const createdTask = await response.json();
      onSave(createdTask);
      alert('Task published successfully!');
    } catch (err: any) {
      console.error('Task Creation Error:', err);
      alert(`Error: ${err.message || 'An unexpected error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Task</h1>
          <p className="text-stone-400 mt-1">Define data parameters for contributor execution.</p>
        </div>
        <div className="px-4 py-2 bg-purple-900/20 text-purple-400 rounded-lg text-sm font-bold border border-purple-800 flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Admin Console
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-2xl border border-white/10 p-8 shadow-sm space-y-8">

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Task Title</label>
            <input
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-white"
              placeholder="e.g. Record 'Hello World'"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Task Type</label>
            <select
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-white"
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as TaskType })}
            >
              {Object.values(TaskType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Project & Params */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Project / Campaign</label>
            <input
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white"
              placeholder="e.g. Project Echo"
              value={formData.project}
              onChange={e => setFormData({ ...formData, project: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Compensation (₹)</label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white"
              value={formData.compensation}
              onChange={e => setFormData({ ...formData, compensation: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Est. Time (Sec)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white"
              value={formData.estimatedTimeSec}
              onChange={e => setFormData({ ...formData, estimatedTimeSec: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Difficulty</label>
            <select
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white"
              value={formData.difficulty}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Language</label>
            <select
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white"
              value={formData.language}
              onChange={e => setFormData({ ...formData, language: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Requirements (Comma sep.)</label>
            <input
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white"
              placeholder="Headphones, 1080p, etc"
              value={formData.requirementsString}
              onChange={e => setFormData({ ...formData, requirementsString: e.target.value })}
            />
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-6 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Prompt / Script</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white resize-none"
              placeholder="What should the user see or read?"
              value={formData.prompt}
              onChange={e => setFormData({ ...formData, prompt: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Detailed Instructions</label>
            <textarea
              required
              rows={4}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white resize-none"
              placeholder="Step-by-step guide for the contributor..."
              value={formData.instructions}
              onChange={e => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">AI Capability Purpose</label>
            <input
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white"
              placeholder="e.g. Speech Recognition Training"
              value={formData.aiCapability}
              onChange={e => setFormData({ ...formData, aiCapability: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Data Usage Scope</label>
            <input
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white"
              placeholder="e.g. Internal R&D Only"
              value={formData.dataUsage}
              onChange={e => setFormData({ ...formData, dataUsage: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Context Image URL (Optional)</label>
            <input
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg outline-none text-white font-mono text-sm"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-4">
          <Button type="button" variant="ghost">Cancel</Button>
          <Button type="submit" isLoading={isLoading} className="w-48">
            <Save className="h-4 w-4 mr-2" /> Publish Task
          </Button>
        </div>

      </form>
    </div>
  );
};
