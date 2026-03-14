import { useState } from 'react';
import { Calculator, FileText, TrendingUp, IndianRupee, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

const investmentInsights = [
  {
    id: 1,
    title: 'Market Analysis',
    description: 'Real-time property market trends and price predictions',
    icon: TrendingUp,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 2,
    title: 'ROI Calculator',
    description: 'Calculate potential returns on your property investment',
    icon: IndianRupee,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 3,
    title: 'Tax Benefits',
    description: 'Maximize deductions under Section 80C and 24(b)',
    icon: FileText,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    id: 4,
    title: 'Affordability Check',
    description: 'Find properties that match your budget and eligibility',
    icon: Calculator,
    color: 'bg-orange-100 text-orange-600'
  }
];

export function FinancialJourney() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  const calculateEMI = (): EMIResult => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = loanTenure * 12;
    
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - P;
    
    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    };
  };

  const emiResult = calculateEMI();

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <section ref={ref} className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
            Complete Financial Support
          </span>
          <h2 className="heading-2 text-gray-900 mt-2">
            From Dream to Keys
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            We guide you through every step of your home buying journey, 
            from eligibility check to getting your keys.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Journey Steps */}
          <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="font-semibold text-gray-800 text-xl mb-6">Smart Property Investment</h3>
              
              <div className="grid gap-4">
                {investmentInsights.map((insight) => (
                  <div key={insight.id} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#1E3A5F]/20 hover:shadow-md transition-all">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${insight.color}`}>
                      <insight.icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Tips */}
              <div className="mt-8 p-4 bg-gradient-to-br from-[#1E3A5F]/5 to-[#FF6B35]/5 rounded-2xl border border-[#1E3A5F]/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6B35] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Investment Tip</h5>
                    <p className="text-sm text-gray-600">
                      Properties near upcoming metro stations typically see 15-25% appreciation 
                      within 2 years of metro launch. Check our market reports for insights.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <a href="/market-research" className="block">
                  <Button className="w-full btn-primary">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    View Market Research
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Right - EMI Calculator */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-xl">EMI Calculator</h3>
                  <p className="text-sm text-gray-500">Plan your monthly payments</p>
                </div>
              </div>

              {/* Loan Amount */}
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                  <span className="text-lg font-bold text-[#1E3A5F]">{formatCurrency(loanAmount)}</span>
                </div>
                <Slider
                  value={[loanAmount]}
                  onValueChange={(value) => setLoanAmount(value[0])}
                  max={100000000}
                  min={1000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>₹10L</span>
                  <span>₹10Cr</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                  <span className="text-lg font-bold text-[#1E3A5F]">{interestRate}%</span>
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                  max={15}
                  min={6}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>6%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Loan Tenure */}
              <div className="mb-8">
                <div className="flex justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
                  <span className="text-lg font-bold text-[#1E3A5F]">{loanTenure} Years</span>
                </div>
                <Slider
                  value={[loanTenure]}
                  onValueChange={(value) => setLoanTenure(value[0])}
                  max={30}
                  min={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>5 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2d4a6f] rounded-2xl p-6 text-white">
                <div className="text-center mb-6">
                  <p className="text-white/70 text-sm mb-2">Monthly EMI</p>
                  <div className="flex items-center justify-center gap-2">
                    <IndianRupee className="w-8 h-8" />
                    <span className="text-4xl font-bold">
                      {emiResult.emi.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mt-1">per month</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Total Interest</p>
                    <p className="text-xl font-semibold">{formatCurrency(emiResult.totalInterest)}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Total Amount</p>
                    <p className="text-xl font-semibold">{formatCurrency(emiResult.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 mt-4 text-sm text-gray-500">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  This is an approximate calculation. Actual EMI may vary based on 
                  bank policies and your credit profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
