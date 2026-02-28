import { Home, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ctaOptions = [
  {
    id: 'buyer',
    icon: Home,
    title: 'Buy a Home',
    description: 'Find your perfect home from our extensive collection of verified properties.',
    cta: 'Start Searching',
    color: 'from-[#1E3A5F] to-[#2d4a6f]',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'seller',
    icon: Users,
    title: 'Sell Property',
    description: 'List your property and reach thousands of potential buyers instantly.',
    cta: 'List Now',
    color: 'from-[#FF6B35] to-[#ff8555]',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'investor',
    icon: TrendingUp,
    title: 'Invest',
    description: 'Explore high-return investment opportunities in prime locations.',
    cta: 'Explore Deals',
    color: 'from-[#00C9A7] to-[#00e6c0]',
    bgColor: 'bg-emerald-50'
  }
];

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1E3A5F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF6B35]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="heading-2 text-gray-900 mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whether you're buying your first home, selling a property, or looking for 
            investment opportunities - we're here to help.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {ctaOptions.map((option, index) => (
            <div
              key={option.id}
              className={`group relative overflow-hidden rounded-3xl transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Background */}
              <div className={`absolute inset-0 ${option.bgColor} transition-transform duration-500 group-hover:scale-105`} />
              
              {/* Content */}
              <div className="relative p-8 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>

                {/* Text */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-8 flex-grow">
                  {option.description}
                </p>

                {/* CTA Button */}
                <Button
                  onClick={() => {
                    if (option.id === 'buyer') window.location.href = '/buy';
                    else if (option.id === 'seller') window.location.href = '/contact';
                    else if (option.id === 'investor') window.location.href = '/commercial';
                  }}
                  className={`w-full bg-gradient-to-r ${option.color} text-white hover:shadow-lg transition-all duration-300 group/btn`}
                >
                  {option.cta}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Decorative Corner */}
              <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${option.color} opacity-10`} />
            </div>
          ))}
        </div>

        {/* Bottom Trust Bar */}
        <div className={`mt-16 flex flex-wrap justify-center items-center gap-8 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm">100% Verified Listings</span>
          </div>
          {/* Zero Brokerage removed */}
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm">24/7 Support</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm">Legal Assistance</span>
          </div>
        </div>
      </div>
    </section>
  );
}
