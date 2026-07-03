import { Star, Quote } from 'lucide-react';

export default function Reviews() {
  const reviews = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      rating: 5,
      comment: 'CodeElevate transformed our vision into a stunning web application within our tight budget. Their team is professional, responsive, and truly cares about client success.',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      borderGradient: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Michael Chen',
      role: 'Founder, FitLife App',
      rating: 5,
      comment: 'Amazing experience! They delivered our mobile app ahead of schedule and the ongoing maintenance has been flawless. Highly recommend for anyone looking for quality IT solutions.',
      gradient: 'from-cyan-500/10 to-blue-500/10',
      borderGradient: 'from-cyan-500 to-blue-500',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director, ShopHub',
      rating: 5,
      comment: 'The AI integration they implemented boosted our customer engagement by 300%. Their expertise in SEO also helped us rank on the first page. Best investment we made!',
      gradient: 'from-violet-500/10 to-purple-500/10',
      borderGradient: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-4 text-white">What Our Clients Say</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${review.borderGradient} opacity-50 group-hover:opacity-100 transition-opacity rounded-2xl blur-xl`} />
              <div className={`relative bg-gradient-to-br ${review.gradient} backdrop-blur-sm p-8 rounded-2xl border border-white/10 bg-gray-900`}>
                <Quote className="absolute top-4 right-4 w-12 h-12 text-white/10" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-gray-300 mb-6 relative z-10">
                  "{review.comment}"
                </p>

                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${review.borderGradient} rounded-full flex items-center justify-center text-black`}>
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white">{review.name}</div>
                    <div className="text-sm text-gray-400">{review.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
