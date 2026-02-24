import { Globe, Video, FileText, Calculator, Phone, Clock, CheckCircle, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const nriServices = [
  {
    icon: Video,
    title: 'Virtual Tours',
    description: 'Experience properties in 360° from anywhere in the world'
  },
  {
    icon: FileText,
    title: 'Power of Attorney',
    description: 'Complete assistance with POA documentation'
  },
  {
    icon: Calculator,
    title: 'Tax Benefits',
    description: 'Maximize your tax savings on property investment'
  },
  {
    icon: Phone,
    title: 'Video Consultation',
    description: 'Connect with our experts at your convenience'
  }
];

const taxBenefits = [
  'Tax deduction up to ₹2 lakh on home loan interest (Section 24)',
  'Additional deduction of ₹1.5 lakh under Section 80EEA',
  'Exemption on long-term capital gains under Section 54',
  'No TDS on property purchase below ₹50 lakh'
];

export function NRISection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-[#1E3A5F] to-[#152a45] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#00C9A7]/10 rounded-full blur-3xl" />
        {/* World Map Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            <path
              d="M150,200 Q200,150 250,200 T350,200 Q400,150 450,200"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Globe className="w-5 h-5 text-[#FF6B35]" />
              <span className="text-white/90 text-sm font-medium">For NRIs</span>
            </div>

            <h2 className="heading-2 text-white mb-4">
              Invest in Your
              <span className="text-[#FF6B35]"> Roots</span>
            </h2>
            <p className="text-white/70 text-lg mb-8">
              NRIs contribute 25% of India's real estate investments. We make it 
              easy for you to invest in your homeland with complete transparency 
              and expert guidance.
            </p>

            {/* Services Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {nriServices.map((service, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FF6B35] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">{service.title}</h3>
                  <p className="text-white/60 text-sm">{service.description}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <a href="/nri">
                <Button className="btn-secondary">
                  <Video className="w-5 h-5 mr-2" />
                  Schedule Video Call
                </Button>
              </a>
            </div>
          </div>

          {/* Right - Tax Benefits & Timezones */}
          <div className={`space-y-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Tax Benefits Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-xl">Tax Benefits for NRIs</h3>
                  <p className="text-sm text-gray-500">Maximize your returns</p>
                </div>
              </div>

              <ul className="space-y-4">
                {taxBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                <p className="text-emerald-800 text-sm">
                  <span className="font-semibold">Did you know?</span> NRIs invested 
                  <span className="font-bold"> $13.1 billion </span>
                  in Indian real estate in 2023.
                </p>
              </div>
            </div>

            {/* Timezone Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#FF6B35]" />
                <h3 className="font-semibold text-gray-800">Our Global Presence</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { city: 'Mumbai', time: 'IST', flag: '🇮🇳' },
                  { city: 'Dubai', time: 'GST', flag: '🇦🇪' },
                  { city: 'London', time: 'GMT', flag: '🇬🇧' },
                  { city: 'New York', time: 'EST', flag: '🇺🇸' },
                  { city: 'Singapore', time: 'SGT', flag: '🇸🇬' },
                  { city: 'Sydney', time: 'AEDT', flag: '🇦🇺' }
                ].map((location, index) => (
                  <div key={index} className="text-center p-3 rounded-xl bg-gray-50">
                    <span className="text-2xl">{location.flag}</span>
                    <p className="font-medium text-gray-800 text-sm mt-1">{location.city}</p>
                    <p className="text-xs text-gray-500">{location.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight Connect */}
            <div className="bg-gradient-to-r from-[#FF6B35] to-[#ff8555] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Plane className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Visiting India?</h4>
                  <p className="text-white/80 text-sm">
                    Schedule site visits in advance. We'll arrange everything.
                  </p>
                </div>
                <a href="/nri">
                  <Button className="ml-auto bg-white text-[#FF6B35] hover:bg-white/90">
                    Book Visit
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
