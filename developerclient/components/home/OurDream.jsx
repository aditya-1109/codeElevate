import { Target, Zap, DollarSign, Clock } from 'lucide-react';

export default function OurDream() {
  const features = [
    {
      icon: Target,
      title: 'Complete IT Solutions',
      description: 'End-to-end services covering all your technology needs',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Zap,
      title: 'Full Service & Maintenance',
      description: 'Ongoing support to keep your projects running smoothly',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: DollarSign,
      title: 'Budget-Friendly',
      description: 'Premium quality solutions that fit your financial constraints',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Clock,
      title: 'Quick Delivery',
      description: 'Fast turnaround times without compromising on quality',
      color: 'from-fuchsia-500 to-pink-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-6 text-white">Our Dream</h2>
          <p className="text-lg text-gray-400">
            Our dream is to provide complete IT solutions with maintenance, offering users 
            full services to bring their dreams from mind to the real world within a very low 
            budget and very less time. We believe that everyone deserves access to quality 
            technology solutions, regardless of their budget constraints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border hover:shadow-lg hover:shadow-gray-500 border-white/10 hover:border-white/20 transition-all overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <feature.icon className="absolute text-white opacity-10 w-20 h-20 " />
              {/* <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 relative`}>
                
              </div> */}
              <h3 className="text-xl text-center mb-3 text-white w-full">{feature.title}</h3>
              <p className="text-gray-400 text-center w-full">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
