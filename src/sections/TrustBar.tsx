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
  return null;
}
