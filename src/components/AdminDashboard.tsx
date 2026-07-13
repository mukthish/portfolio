'use client'

import { useState } from 'react'
import { TerminalCard } from './ui/TerminalCard'
import { TerminalButton } from './ui/TerminalButton'
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react'

// Types matching database schema
interface Project {
  id: string
  title: string
  description: string
  problem: string
  techStack: string[]
  outcome: string
  githubUrl: string | null
  liveUrl: string | null
  isFeatured: boolean
  displayOrder: number
}

interface HeroSettings {
  id: string
  name: string
  subtitle: string
  techStack: string[]
  githubUrl: string | null
  linkedinUrl: string | null
}

interface AdminDashboardProps {
  initialProjects: Project[]
  initialHeroSettings: HeroSettings | null
}

export default function AdminDashboard({ initialProjects, initialHeroSettings }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'hero'>('projects')
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  // Project Form State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectProblem, setProjectProblem] = useState('')
  const [projectOutcome, setProjectOutcome] = useState('')
  const [projectTechStack, setProjectTechStack] = useState('')
  const [projectGithub, setProjectGithub] = useState('')
  const [projectLive, setProjectLive] = useState('')
  const [projectFeatured, setProjectFeatured] = useState(false)
  const [projectOrder, setProjectOrder] = useState('0')

  // Hero Form State
  const [heroName, setHeroName] = useState(initialHeroSettings?.name || '')
  const [heroSubtitle, setHeroSubtitle] = useState(initialHeroSettings?.subtitle || '')
  const [heroTechStack, setHeroTechStack] = useState(initialHeroSettings?.techStack.join(', ') || '')
  const [heroGithub, setHeroGithub] = useState(initialHeroSettings?.githubUrl || '')
  const [heroLinkedin, setHeroLinkedin] = useState(initialHeroSettings?.linkedinUrl || '')

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  // --- Project Handlers ---
  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectTitle(project.title)
    setProjectDescription(project.description)
    setProjectProblem(project.problem)
    setProjectOutcome(project.outcome)
    setProjectTechStack(project.techStack.join(', '))
    setProjectGithub(project.githubUrl || '')
    setProjectLive(project.liveUrl || '')
    setProjectFeatured(project.isFeatured)
    setProjectOrder(project.displayOrder.toString())
  }

  const handleResetProjectForm = () => {
    setEditingProject(null)
    setProjectTitle('')
    setProjectDescription('')
    setProjectProblem('')
    setProjectOutcome('')
    setProjectTechStack('')
    setProjectGithub('')
    setProjectLive('')
    setProjectFeatured(false)
    setProjectOrder('0')
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      title: projectTitle,
      description: projectDescription,
      problem: projectProblem,
      outcome: projectOutcome,
      techStack: projectTechStack.split(',').map((s) => s.trim()).filter(Boolean),
      githubUrl: projectGithub || null,
      liveUrl: projectLive || null,
      isFeatured: projectFeatured,
      displayOrder: parseInt(projectOrder) || 0,
    }

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const savedProject = await res.json()
        if (editingProject) {
          setProjects(projects.map((p) => (p.id === savedProject.id ? savedProject : p)))
          showMessage('PROJECT_UPDATED: Changes saved successfully.')
        } else {
          setProjects([savedProject, ...projects])
          showMessage('PROJECT_CREATED: New entry initialized.')
        }
        handleResetProjectForm()
      } else {
        showMessage('API_ERROR: Action failed.', 'error')
      }
    } catch {
      showMessage('NETWORK_ERROR: Request aborted.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Execute deletion on project module?')) return
    setLoading(true)

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id))
        showMessage('PROJECT_DELETED: Module wiped.')
      } else {
        showMessage('API_ERROR: Deletion rejected.', 'error')
      }
    } catch {
      showMessage('NETWORK_ERROR: Request aborted.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // --- Hero Handlers ---
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: heroName,
      subtitle: heroSubtitle,
      techStack: heroTechStack.split(',').map((s) => s.trim()).filter(Boolean),
      githubUrl: heroGithub || null,
      linkedinUrl: heroLinkedin || null,
    }

    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        showMessage('HERO_UPDATED: Settings synchronized successfully.')
      } else {
        showMessage('API_ERROR: Update failed.', 'error')
      }
    } catch {
      showMessage('NETWORK_ERROR: Request aborted.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 text-sm">
      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-border/30 pb-3">
        <button
          onClick={() => setActiveTab('projects')}
          className={`py-2.5 px-4 transition-all text-xs font-bold uppercase tracking-wider rounded-xl ${
            activeTab === 'projects'
              ? 'bg-accent/15 text-accent'
              : 'text-foreground/60 hover:text-foreground hover:bg-card-bg/25'
          }`}
        >
          Projects Module
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`py-2.5 px-4 transition-all text-xs font-bold uppercase tracking-wider rounded-xl ${
            activeTab === 'hero'
              ? 'bg-accent/15 text-accent'
              : 'text-foreground/60 hover:text-foreground hover:bg-card-bg/25'
          }`}
        >
          Hero Module
        </button>
      </div>

      {message && (
        <div
          className={`border p-4 flex items-center gap-2 rounded-2xl backdrop-blur-md ${
            message.type === 'success'
              ? 'bg-accent/10 border-accent/30 text-accent font-semibold'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-500 font-semibold'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{message.text}</span>
        </div>
      )}

      {/* --- Projects Section --- */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects List */}
          <TerminalCard title="Active Projects">
            <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
              {projects.length === 0 ? (
                <p className="text-foreground/40 italic text-xs">No project units indexed.</p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex justify-between items-center bg-slate-800/10 border border-border/30 p-4 rounded-2xl hover:border-accent/30 transition-all"
                  >
                    <div>
                      <span className="text-foreground font-bold text-sm block">{project.title}</span>
                      <div className="text-[10px] text-foreground/50 font-mono mt-0.5">
                        Order: {project.displayOrder} | Featured: {project.isFeatured ? 'Y' : 'N'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-foreground/60 hover:text-accent p-2 bg-card-bg/35 rounded-lg border border-border/40 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-foreground/60 hover:text-rose-500 p-2 bg-card-bg/35 rounded-lg border border-border/40 transition-colors"
                        title="Delete Project"
                        disabled={loading}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TerminalCard>

          {/* Project Form */}
          <TerminalCard title={editingProject ? 'Edit Project' : 'Add New Project'}>
            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-foreground/60 block">Project Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                  placeholder="e.g. CLI Engine v1"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/60 block">Description</label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                  placeholder="Summary of the project..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/60 block">Challenge (Problem Statement)</label>
                <textarea
                  value={projectProblem}
                  onChange={(e) => setProjectProblem(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                  placeholder="What was the core problem?"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/60 block">Outcome</label>
                <textarea
                  value={projectOutcome}
                  onChange={(e) => setProjectOutcome(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                  placeholder="What was the result or system impact?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground/60 block">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={projectTechStack}
                    onChange={(e) => setProjectTechStack(e.target.value)}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="React, Rust, AWS"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-foreground/60 block">Display Order</label>
                  <input
                    type="number"
                    value={projectOrder}
                    onChange={(e) => setProjectOrder(e.target.value)}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground/60 block">Github URL (optional)</label>
                  <input
                    type="url"
                    value={projectGithub}
                    onChange={(e) => setProjectGithub(e.target.value)}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-foreground/60 block">Live URL (optional)</label>
                  <input
                    type="url"
                    value={projectLive}
                    onChange={(e) => setProjectLive(e.target.value)}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1 select-none">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectFeatured}
                  onChange={(e) => setProjectFeatured(e.target.checked)}
                  className="bg-background border-border/50 text-accent focus:ring-0 rounded"
                />
                <label htmlFor="featured" className="text-xs text-foreground/80 cursor-pointer">
                  Flag as Featured Project
                </label>
              </div>

              <div className="flex gap-4">
                <TerminalButton type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : 'Save Project Module'}
                </TerminalButton>
                {editingProject && (
                  <TerminalButton
                    type="button"
                    variant="outline"
                    onClick={handleResetProjectForm}
                    className="border-rose-500/40 text-rose-500 hover:bg-rose-500/10"
                  >
                    Cancel
                  </TerminalButton>
                )}
              </div>
            </form>
          </TerminalCard>
        </div>
      )}

      {/* --- Hero Section --- */}
      {activeTab === 'hero' && (
        <div className="max-w-2xl mx-auto">
          <TerminalCard title="Edit Hero Section Settings">
            <form onSubmit={handleSaveHero} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-foreground/60 block">Developer Name / Title</label>
                <input
                  type="text"
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  required
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                  placeholder="e.g. Mukthish Babu."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/60 block">Hero Subtitle</label>
                <textarea
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                  placeholder="Describe your role and expertise..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-foreground/60 block">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={heroTechStack}
                  onChange={(e) => setHeroTechStack(e.target.value)}
                  className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                  placeholder="TypeScript, Python, Rust"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-foreground/60 block">Github URL (optional)</label>
                  <input
                    type="url"
                    value={heroGithub}
                    onChange={(e) => setHeroGithub(e.target.value)}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-foreground/60 block">LinkedIn URL (optional)</label>
                  <input
                    type="url"
                    value={heroLinkedin}
                    onChange={(e) => setHeroLinkedin(e.target.value)}
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <TerminalButton type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Saving...' : 'Save Hero Settings'}
                </TerminalButton>
              </div>
            </form>
          </TerminalCard>
        </div>
      )}
    </div>
  )
}
