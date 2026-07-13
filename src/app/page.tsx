import { prisma } from '@/lib/prisma'
import { TerminalCard } from '@/components/ui/TerminalCard'
import { Terminal } from 'lucide-react'

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

// Opt-out of static rendering since we want to fetch the latest projects from DB
export const revalidate = 0

export default async function HomePage() {
  const [projects, heroSettings] = await Promise.all([
    prisma.project.findMany({
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    }),
    prisma.heroSettings.findFirst(),
  ])

  const hero = {
    name: heroSettings?.name || "Mukthish Babu.",
    subtitle: heroSettings?.subtitle || "Full-Stack Engineer & Systems Architect.\nI build robust backend pipelines, developer tools, and high-performance interactive interfaces.",
    techStack: heroSettings?.techStack || ["TypeScript", "Python", "Rust", "Go", "C++", "Next.js", "FastAPI", "React", "Docker", "AWS"],
    githubUrl: heroSettings?.githubUrl || "",
    linkedinUrl: heroSettings?.linkedinUrl || "",
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-foreground/10 dark:border-white/10 bg-card-bg/5 backdrop-blur-2xl shadow-xl p-10 md:py-24 text-center flex flex-col items-center group transition-all duration-500 hover:border-accent/30">
        <div className="absolute -z-10 -top-20 -left-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-screen filter blur-[100px] opacity-10" />
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 pb-6 tracking-tight text-transparent bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text">
          {hero.name}
        </h1>
        <p className="whitespace-pre-line text-xl md:text-2xl max-w-2xl leading-relaxed text-foreground/90 font-sans mb-8">
          {hero.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mb-8">
           {hero.techStack.map((tech) => (
             <span key={tech} className="text-xs md:text-sm bg-card-bg/40 text-foreground px-4 py-2 rounded-full border border-border/50 backdrop-blur-md shadow-sm">
               {tech}
             </span>
           ))}
        </div>

        {/* Social Links */}
        {(hero.githubUrl || hero.linkedinUrl) && (
          <div className="flex items-center gap-4">
            {hero.githubUrl && (
              <a
                href={hero.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-foreground/10 dark:border-white/10 text-foreground/60 hover:text-accent hover:border-accent/40 bg-card-bg/5 transition-all shadow-md"
                aria-label="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            )}
            {hero.linkedinUrl && (
              <a
                href={hero.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-foreground/10 dark:border-white/10 text-foreground/60 hover:text-accent hover:border-accent/40 bg-card-bg/5 transition-all shadow-md"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Projects List */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black text-foreground">Featured Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <TerminalCard
              key={project.id}
              title={project.isFeatured ? "FEATURED MODULE" : "PROJECT MODULE"}
            >
              <div className="flex flex-col h-full space-y-4 font-sans text-sm">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                  {project.title}
                </h3>

                <p className="text-foreground/80 leading-relaxed text-sm line-clamp-3">
                  {project.description}
                </p>



                <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-card-bg/40 text-foreground px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-border/30 text-xs font-semibold">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
                    >
                      <span>View Source</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
                    >
                      <span>Live Demo</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </TerminalCard>
          ))}
        </div>
      </section>
    </div>
  )
}
