import { useEffect, useRef, useState } from 'react';
import { Shield, CheckCircle, Award, Users, TrendingUp, Lock } from 'lucide-react';

interface TrustItem {
  icon: React.ElementType;
  value: string;
  label: string;
  suffix?: string;
}

const trustItems: TrustItem[] = [
  { icon: Shield, value: '100', label: 'Legal Verification', suffix: '%' },
  { icon: CheckCircle, value: '10000', label: 'Verified Properties', suffix: '+' },
  { icon: Award, value: '500', label: 'Cr Value Transacted', suffix: '+' },
  { icon: Users, value: '50000', label: 'Happy Families', suffix: '+' },
  { icon: TrendingUp, value: '95', label: 'On-Time Delivery', suffix: '%' },
  { icon: Lock, value: '0', label: 'Fraud Cases', suffix: '' }
];

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const target = parseInt(value);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  const formatNumber = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(0)}`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-[#1E3A5F]">
      {formatNumber(count)}{suffix}
    </div>
  );
}

export function TrustBar() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="heading-3 text-gray-900 mb-3">Why Choose Properties Professor?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge technology with deep market expertise to deliver 
            a real estate experience that's transparent, secure, and tailored to you.
          </p>
        </div>

        {/* Trust Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center border border-gray-100 hover:border-[#FF6B35]/30 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <item.icon className="w-7 h-7 text-white" />
              </div>

              {/* Counter */}
              <AnimatedCounter value={item.value} suffix={item.suffix} />

              {/* Label */}
              <p className="text-sm text-gray-500 mt-2 font-medium">{item.label}</p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6B35]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">RERA Registered</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
            <Lock className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Blockchain Verified</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
