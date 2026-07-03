import { Globe, Smartphone, Brain, Settings, TrendingUp, Calculator, Code, Palette, Database, Shield, Cloud, Headphones } from 'lucide-react';
import Link  from 'next/link';

export default function Services() {
  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Create stunning, responsive websites that engage your audience and drive results.',
      features: [
        'Custom website design and development',
        'E-commerce solutions',
        'Content Management Systems (CMS)',
        'Progressive Web Apps (PWA)',
        'Responsive and mobile-first design',
        'Performance optimization',
      ],
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Build powerful native and cross-platform mobile applications for iOS and Android.',
      features: [
        'Native iOS and Android development',
        'Cross-platform apps (React Native, Flutter)',
        'UI/UX design for mobile',
        'App Store optimization',
        'Push notifications and analytics',
        'Offline functionality',
      ],
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Brain,
      title: 'AI Integration',
      description: 'Leverage artificial intelligence to automate processes and gain competitive advantage.',
      features: [
        'Chatbots and virtual assistants',
        'Machine learning models',
        'Natural Language Processing (NLP)',
        'Computer vision solutions',
        'Predictive analytics',
        'AI-powered recommendations',
      ],
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Code,
      title: 'Custom Software Development',
      description: 'Tailored software solutions designed specifically for your business needs.',
      features: [
        'Business process automation',
        'API development and integration',
        'Legacy system modernization',
        'Enterprise software solutions',
        'SaaS application development',
        'Microservices architecture',
      ],
      gradient: 'from-fuchsia-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'SEO & Digital Marketing',
      description: 'Boost your online visibility and reach your target audience effectively.',
      features: [
        'Search Engine Optimization (SEO)',
        'Content marketing strategy',
        'Social media marketing',
        'Email marketing campaigns',
        'Analytics and reporting',
        'Conversion rate optimization',
      ],
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Create beautiful, intuitive user interfaces that delight your customers.',
      features: [
        'User research and personas',
        'Wireframing and prototyping',
        'Visual design and branding',
        'Usability testing',
        'Design systems',
        'Accessibility compliance',
      ],
      gradient: 'from-rose-500 to-red-500',
    },
    {
      icon: Database,
      title: 'Database Solutions',
      description: 'Design and implement robust database systems for your data management needs.',
      features: [
        'Database design and architecture',
        'SQL and NoSQL solutions',
        'Data migration services',
        'Database optimization',
        'Backup and recovery solutions',
        'Real-time data processing',
      ],
      gradient: 'from-lime-500 to-green-500',
    },
    {
      icon: Cloud,
      title: 'Cloud Services',
      description: 'Migrate to the cloud and scale your infrastructure with ease.',
      features: [
        'Cloud migration strategy',
        'AWS, Azure, Google Cloud setup',
        'Serverless architecture',
        'DevOps and CI/CD pipelines',
        'Cloud security',
        'Cost optimization',
      ],
      gradient: 'from-sky-500 to-indigo-500',
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Protect your digital assets with comprehensive security solutions.',
      features: [
        'Security audits and testing',
        'GDPR and compliance consulting',
        'Penetration testing',
        'SSL certificate implementation',
        'Data encryption',
        'Security monitoring',
      ],
      gradient: 'from-red-500 to-orange-500',
    },
    {
      icon: Settings,
      title: 'Maintenance & Support',
      description: 'Keep your systems running smoothly with our ongoing support services.',
      features: [
        '24/7 technical support',
        'Regular updates and patches',
        'Performance monitoring',
        'Bug fixes and troubleshooting',
        'Feature enhancements',
        'Documentation and training',
      ],
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Calculator,
      title: 'Budget Consulting',
      description: 'Strategic planning to help you maximize ROI within your budget constraints.',
      features: [
        'Project cost estimation',
        'Technology stack recommendations',
        'MVP development strategy',
        'Resource allocation planning',
        'ROI analysis',
        'Phased development approach',
      ],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Headphones,
      title: 'Consultation Services',
      description: 'Expert advice to guide your digital transformation journey.',
      features: [
        'Technology strategy consulting',
        'Digital transformation roadmap',
        'Architecture review',
        'Best practices and recommendations',
        'Team training and workshops',
        'Project management',
      ],
      gradient: 'from-blue-500 to-violet-500',
    },
  ];

  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-950 via-black to-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl mb-6 text-white">Our Services</h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Comprehensive IT solutions tailored to your business needs
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient}/10 shadow-lg shadow-gray-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <service.icon className="w-10 h-10 text-white"  />
                    </div>
                    <div>
                      <h3 className="text-2xl mb-2 text-white">{service.title}</h3>
                      <p className="text-gray-400">{service.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mt-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-gray-300">
                        <span className={`bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mt-1`}>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-gray-900 to-black p-12 rounded-3xl border border-white/10">
            <h2 className="text-3xl md:text-5xl mb-6 text-white">Ready to Get Started?</h2>
            <p className="text-lg text-gray-400 mb-8">
              Let's discuss how we can help bring your vision to life with our 
              comprehensive IT solutions.
            </p>
            <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <button  className="flex px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black">
                  Get a Free Quote
                </button>
              </Link>
              <Link href="/projects">
                <button className="px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10">
                  View Our Work
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
