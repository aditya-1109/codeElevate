'use client'
import { Target, Users, Award, Heart } from 'lucide-react';
import { use, useEffect, useRef, useState } from 'react';


export function useStatsCrawler(target: number, shouldStart: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return; // only start when visible

    let current = 0;

    const interval = setInterval(() => {
      if (current < target) {
        current++;
        setCount(current);
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [target, shouldStart]);

  return count;
}

export default function About() {
  
    const [start, setStart] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To empower businesses of all sizes with cutting-edge IT solutions that are both affordable and effective.',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-500/10 to-teal-500/10',
    },
    {
      icon: Heart,
      title: 'Our Vision',
      description: 'To be the go-to IT partner for startups and businesses looking to turn their digital dreams into reality.',
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-500/10 to-blue-500/10',
    },
    {
      icon: Users,
      title: 'Our Team',
      description: 'A diverse group of passionate developers, designers, and strategists committed to your success.',
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/10 to-purple-500/10',
    },
    {
      icon: Award,
      title: 'Our Promise',
      description: 'Quality solutions delivered on time and within budget, with ongoing support every step of the way.',
      gradient: 'from-fuchsia-500 to-pink-500',
      bgGradient: 'from-fuchsia-500/10 to-pink-500/10',
    },
  ];

  const stats = [
    { number: 100, label: 'Projects Completed', gradient: 'from-emerald-500 to-teal-500' },
    { number: 50, label: 'Happy Clients', gradient: 'from-cyan-500 to-blue-500' },
    { number: 5, label: 'Years Experience', gradient: 'from-violet-500 to-purple-500' },
    { number: 24, label: 'Support Available', gradient: 'from-fuchsia-500 to-pink-500' },
  ];

   useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStart(true);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);



  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-950 via-black to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl mb-6 text-white">About CodeElevate</h1>
            <p className="text-xl md:text-2xl text-gray-300">
              We're on a mission to make quality IT solutions accessible to everyone, 
              regardless of budget constraints.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl mb-6 text-white">Our Story</h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  CodeElevate was founded with a simple belief: everyone deserves access to 
                  world-class IT solutions, regardless of their budget. We saw too many great 
                  ideas fail simply because the cost of development was prohibitive.
                </p>
                <p>
                  Our team of experienced developers, designers, and project managers came 
                  together with a shared vision - to create a company that delivers premium 
                  quality work at prices that make sense for startups, small businesses, and 
                  entrepreneurs.
                </p>
                <p>
                  Today, we've helped over 100 clients bring their digital dreams to life, 
                  from simple websites to complex AI-powered applications. Our commitment to 
                  quality, affordability, and ongoing support sets us apart in the industry.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1758876203342-fc14c0bba67c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NjMyODcxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Our Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl mb-4 text-white">Our Values</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative hover:shadow-lg hover:shadow-gray-500 bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all text-center overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative jusitfy-center items-center flex flex-col">
                     <value.icon className="absolute text-white opacity-10 w-20 h-20 " />
                
                  <h3 className="text-xl mb-3 text-white">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-950 via-black to-gray-950">
        <div className="container mx-auto px-4">
          <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index}  className="text-center group">
                <div className={`text-4xl font-[900] md:text-6xl mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {useStatsCrawler(stat.number, start)}{stat.label === 'Support Available' ? "/7" : "+"}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl mb-6 text-white">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all group">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl mb-3 text-white">Budget-Friendly</h3>
                <p className="text-gray-400">
                  Premium quality at prices that won't break the bank
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all group">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-xl mb-3 text-white">Fast Delivery</h3>
                <p className="text-gray-400">
                  Quick turnaround times without compromising quality
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10 hover:border-violet-500/50 transition-all group">
                <div className="text-5xl mb-4">🛠️</div>
                <h3 className="text-xl mb-3 text-white">Full Support</h3>
                <p className="text-gray-400">
                  Ongoing maintenance and support for peace of mind
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
