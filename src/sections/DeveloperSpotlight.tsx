import { Building2, CheckCircle, TrendingUp, Award, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const developers = [
  {
    name: 'Lodha Group',
    logo: 'L',
    since: 1980,
    completedProjects: 150,
    ongoingProjects: 25,
    trustScore: 95,
    description: 'India\'s largest real estate developer, known for luxury residential and commercial projects.',
    specialties: ['Luxury Residential', 'Commercial Spaces', 'Townships'],
    awards: ['Best Developer 2023', 'Green Building Excellence'],
    cities: ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad']
  },
  {
    name: 'Prestige Group',
    logo: 'P',
    since: 1986,
    completedProjects: 250,
    ongoingProjects: 40,
    trustScore: 92,
    description: 'South India\'s leading developer with diverse portfolio across residential, commercial, and retail.',
    specialties: ['Integrated Townships', 'IT Parks', 'Malls'],
    awards: ['Most Trusted Brand', 'Best Commercial Developer'],
    cities: ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai']
  },
  {
    name: 'DLF Limited',
    logo: 'D',
    since: 1946,
    completedProjects: 300,
    ongoingProjects: 50,
    trustScore: 90,
    description: 'India\'s largest commercial real estate developer with premium residential projects.',
    specialties: ['Commercial Hubs', 'Premium Residential', 'Retail'],
    awards: ['Lifetime Achievement', 'Best Commercial Project'],
    cities: ['Gurgaon', 'Delhi', 'Chennai', 'Chandigarh']
  }
];

export function DeveloperSpotlight() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
            Trusted Partners
          </span>
          <h2 className="heading-2 text-gray-900 mt-2">
            Meet the Makers
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            We partner with India's most trusted developers who have a proven track 
            record of delivering quality projects on time.
          </p>
        </div>

        {/* Developer Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {developers.map((developer, index) => (
            <div
              key={developer.name}
              className={`group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#FF6B35]/20 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{developer.logo}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{developer.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Since {developer.since}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-bold">{developer.trustScore}</span>
                  </div>
                  <span className="text-xs text-gray-400">TrustScore</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                {developer.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#1E3A5F]">{developer.completedProjects}+</p>
                  <p className="text-xs text-gray-500">Completed Projects</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#FF6B35]">{developer.ongoingProjects}+</p>
                  <p className="text-xs text-gray-500">Ongoing Projects</p>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {developer.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#1E3A5F]/10 text-[#1E3A5F] text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cities */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Presence</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {developer.cities.map((city, i) => (
                    <span key={i} className="text-sm text-gray-600">
                      {city}{i < developer.cities.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div className="flex items-center gap-2 mb-6">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-600">
                  {developer.awards[0]} +{developer.awards.length - 1} more
                </span>
              </div>

              {/* CTA */}
              <Button className="w-full btn-primary">
                View Projects
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={`mt-16 grid md:grid-cols-4 gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { value: '500+', label: 'Verified Developers', icon: Building2 },
            { value: '100%', label: 'RERA Registered', icon: CheckCircle },
            { value: '92%', label: 'Avg TrustScore', icon: TrendingUp },
            { value: '0', label: 'Delayed Projects', icon: Calendar }
          ].map((stat, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <stat.icon className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E3A5F]">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
