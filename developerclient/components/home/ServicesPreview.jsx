import Link  from 'next/link';
import { Globe, Smartphone, Brain, Settings, TrendingUp, Calculator, ArrowRight } from 'lucide-react';

export default function ServicesPreview() {
  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconGradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Smartphone,
      title: 'App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android',
      gradient: 'from-cyan-500/20 to-blue-500/20',
      iconGradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Brain,
      title: 'AI Integration',
      description: 'Cutting-edge AI solutions to automate and enhance your business',
      gradient: 'from-violet-500/20 to-purple-500/20',
      iconGradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Settings,
      title: 'Maintenance',
      description: '24/7 support and maintenance to keep your systems running smoothly',
      gradient: 'from-fuchsia-500/20 to-pink-500/20',
      iconGradient: 'from-fuchsia-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'SEO Optimization',
      description: 'Boost your online visibility and drive organic traffic',
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconGradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Calculator,
      title: 'Budget Consulting',
      description: 'Strategic planning to maximize your ROI within budget constraints',
      gradient: 'from-rose-500/20 to-red-500/20',
      iconGradient: 'from-rose-500 to-red-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-4 text-white">Our Services</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            We provide comprehensive IT solutions tailored to your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative hover:shadow-lg hover:shadow-gray-500 bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative justify-center items-center flex flex-col"> 
               
                  <service.icon className="absolute text-white opacity-10 w-20 h-20 "  />
                
                <h3 className="text-xl mb-3 text-white">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center flex justify-center items-center w-full mt-12">
          <Link href="/services">
            <button className="flex flex-row gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black">
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
