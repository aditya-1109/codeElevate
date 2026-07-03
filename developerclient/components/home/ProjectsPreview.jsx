'use client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { fetchPracticeProjects } from '@/redux/projectsSlice';

export default function ProjectsPreview() {
  const dispatch = useDispatch();
  const { practiceProjects, loading } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchPracticeProjects());
  }, [dispatch]);

  const images = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
  ];

  const getGradient = (difficulty) => {
    if (difficulty === 'Advanced') return 'from-violet-500/90 to-purple-500/90';
    if (difficulty === 'Intermediate') return 'from-emerald-500/90 to-teal-500/90';
    return 'from-cyan-500/90 to-blue-500/90';
  };

  // Display first 3 projects
  const previewProjects = practiceProjects.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-4 text-white font-bold">Our Projects</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore some of our recent developer exercises and starter templates
          </p>
        </div>

        {loading && practiceProjects.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : previewProjects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No projects available to preview.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewProjects.map((project, index) => {
              const coverImage = images[index % images.length];
              const gradient = getGradient(project.difficulty);

              return (
                <div
                  key={project.id}
                  className="group relative bg-black rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-60 group-hover:opacity-80 transition-opacity`} />
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/50 backdrop-blur-sm border border-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                        {project.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-gray-900 to-black flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl mb-2 text-white font-semibold">{project.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>
                    </div>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors font-semibold mt-4"
                    >
                      View Starter Code
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/projects">
            <button className="border border-white/20 flex flex-row justify-center items-center text-white hover:bg-white/10 bg-black/50 backdrop-blur-sm px-6 py-2.5 rounded-full font-semibold transition-all">
              View All Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
