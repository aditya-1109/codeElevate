'use client'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExternalLink, Filter } from 'lucide-react';
import { fetchPracticeProjects } from '@/redux/projectsSlice';
import { ReduxProvider } from '@/redux/provider';

function ProjectsContent() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const dispatch = useDispatch<any>();
  const { practiceProjects, loading } = useSelector((state: any) => state.projects);

  useEffect(() => {
    dispatch(fetchPracticeProjects());
  }, [dispatch]);

  const categories = ['All', 'Intermediate', 'Advanced'];

  const images = [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800'
  ];

  const getTechStack = (title: string, desc: string) => {
    const lower = (title + ' ' + desc).toLowerCase();
    const techs = [];
    if (lower.includes('react') || lower.includes('web') || lower.includes('frontend')) techs.push('React');
    if (lower.includes('node') || lower.includes('backend') || lower.includes('server')) techs.push('Node.js');
    if (lower.includes('app') || lower.includes('mobile') || lower.includes('apk')) techs.push('React Native');
    if (lower.includes('ai') || lower.includes('openai') || lower.includes('llm') || lower.includes('bot')) techs.push('OpenAI API');
    if (lower.includes('video') || lower.includes('player')) techs.push('WebRTC');
    if (lower.includes('purchase') || lower.includes('checkout') || lower.includes('stripe') || lower.includes('payment')) techs.push('Stripe');
    if (lower.includes('db') || lower.includes('postgres') || lower.includes('sql') || lower.includes('database')) techs.push('PostgreSQL');
    
    if (techs.length === 0) {
      return ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS'];
    }
    return techs.slice(0, 4);
  };

  const getGradient = (difficulty: string) => {
    if (difficulty === 'Advanced') {
      return {
        gradient: 'from-violet-500/90 to-purple-500/90',
        tagGradient: 'from-violet-500 to-purple-500'
      };
    }
    if (difficulty === 'Intermediate') {
      return {
        gradient: 'from-emerald-500/90 to-teal-500/90',
        tagGradient: 'from-emerald-500 to-teal-500'
      };
    }
    return {
      gradient: 'from-cyan-500/90 to-blue-500/90',
      tagGradient: 'from-cyan-500 to-blue-500'
    };
  };

  const getFeatures = (desc: string) => {
    const parts = desc.split(/[;,.]/).map(p => p.trim()).filter(p => p.length > 12);
    if (parts.length >= 2) {
      return parts.slice(0, 3).map(p => p.charAt(0).toUpperCase() + p.slice(1));
    }
    return [
      'Production-ready template design',
      'Fully interactive UI components',
      'Comprehensive starter documentation'
    ];
  };

  const filteredProjects = selectedCategory === 'All' 
    ? practiceProjects 
    : practiceProjects.filter((project: any) => project.difficulty === selectedCategory);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-950 via-black to-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl mb-6 text-white font-bold">Our Projects</h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Explore our repository of hands-on technical exercises and starter templates
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-950/50 backdrop-blur-lg border-b border-white/10 sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? 'bg-gradient-to-r px-5 py-1.5 rounded-full from-emerald-500 to-teal-500 text-black font-semibold border-0' 
                  : 'border border-white/20 px-5 py-1.5 rounded-full text-gray-300 hover:bg-white/10 transition-colors'}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-lg">
              No practice projects found matching this category. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProjects.map((project: any, index: number) => {
                const coverImage = images[index % images.length];
                const { gradient, tagGradient } = getGradient(project.difficulty);
                const techStack = getTechStack(project.title, project.description);
                const features = getFeatures(project.description);

                return (
                  <div
                    key={project.id}
                    className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all flex flex-col h-full"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
                      <div className="absolute top-4 right-4">
                        <span className={`bg-gradient-to-r ${tagGradient} text-black font-semibold px-4 py-1 rounded-full text-sm shadow-md`}>
                          {project.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-2xl mb-3 text-white font-semibold">{project.title}</h3>
                      <p className="text-gray-400 mb-6 flex-1">{project.description}</p>

                      <div className="mb-6">
                        <h4 className="text-sm uppercase tracking-wide text-gray-500 mb-3 font-semibold">
                          Technologies Used
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {techStack.map((tech: string, techIndex: number) => (
                            <span
                              key={techIndex}
                              className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-sm uppercase tracking-wide text-gray-500 mb-3 font-semibold">
                          Key Requirements & Features
                        </h4>
                        <ul className="space-y-2">
                          {features.map((feature: string, featureIndex: number) => (
                            <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-emerald-400 mt-0.5">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 mt-auto">
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                        >
                          View Starter Code
                          <ExternalLink className="ml-2 w-4 h-4" />
                        </a>

                        {project.apkLink && (
                          <a
                            href={`http://localhost:3000${project.apkLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                          >
                            Download Demo APK
                            <span className="ml-1.5 font-bold">↓</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-gray-900 to-black p-12 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-3xl md:text-5xl mb-6 text-white font-bold">Have a Project in Mind?</h2>
            <p className="text-lg text-gray-400 mb-8">
              Let's turn your vision into reality. Contact us today for a free consultation.
            </p>
            <button className="bg-gradient-to-r px-8 py-3 rounded-full from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all">
              Start Your Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Projects() {
  return (
    <ReduxProvider>
      <ProjectsContent />
    </ReduxProvider>
  );
}
