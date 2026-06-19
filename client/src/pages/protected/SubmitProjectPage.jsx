import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Github, Loader2 } from 'lucide-react';
import Card from '../../components/common/Card.jsx';

const categories = ['Frontend', 'Backend', 'Full Stack', 'Mobile', 'DevOps', 'Data/ML', 'Other'];

const submitSchema = z.object({
  title: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Keep it under 500 characters'),
  githubUrl: z
    .string()
    .min(1, 'GitHub URL is required')
    .regex(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/, 'Enter a valid GitHub repository URL'),
  techStack: z.string().min(2, 'List at least one technology'),
  category: z.string().min(1, 'Select a category'),
});

export default function SubmitProjectPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(submitSchema) });

  const onSubmit = async (data) => {
    setIsAnalyzing(true);
    // Phase 5/6 will replace this with: await apiClient.post('/projects', data)
    // followed by triggering the GitHub fetch + Groq AI review pipeline.
    await new Promise((r) => setTimeout(r, 1400));
    setIsAnalyzing(false);
    navigate('/my-projects');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-ink-100">Submit a Project</h1>
      <p className="mt-1 text-sm text-ink-500">
        Paste a public GitHub repository and we'll generate a full AI review.
      </p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="label-text" htmlFor="title">Project Name</label>
            <input id="title" className="input-field" placeholder="Realtime Chat Engine" {...register('title')} />
            {errors.title && <p className="mt-1.5 text-xs text-accent-rose">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label-text" htmlFor="description">Project Description</label>
            <textarea
              id="description"
              rows={4}
              className="input-field resize-none"
              placeholder="What does this project do? What problem does it solve?"
              {...register('description')}
            />
            {errors.description && <p className="mt-1.5 text-xs text-accent-rose">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label-text" htmlFor="githubUrl">GitHub Repository URL</label>
            <div className="relative">
              <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                id="githubUrl"
                className="input-field pl-10"
                placeholder="https://github.com/username/repository"
                {...register('githubUrl')}
              />
            </div>
            {errors.githubUrl && <p className="mt-1.5 text-xs text-accent-rose">{errors.githubUrl.message}</p>}
          </div>

          <div>
            <label className="label-text" htmlFor="techStack">Tech Stack</label>
            <input
              id="techStack"
              className="input-field"
              placeholder="React, Node.js, MongoDB (comma separated)"
              {...register('techStack')}
            />
            {errors.techStack && <p className="mt-1.5 text-xs text-accent-rose">{errors.techStack.message}</p>}
          </div>

          <div>
            <label className="label-text" htmlFor="category">Project Category</label>
            <select id="category" className="input-field" defaultValue="" {...register('category')}>
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-accent-rose">{errors.category.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary mt-2 w-full py-3">
            {isAnalyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Analyzing repository...
              </>
            ) : (
              'Submit for AI Review'
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}
