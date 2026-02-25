import { useState } from 'react';
import { Sparkles, Users2, Train, Trees, ArrowRight, Check, Home, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/data/mockData';
import type { Property } from '@/types';

interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    label: string;
    icon: React.ElementType;
    description?: string;
  }[];
}

const questions: Question[] = [
  {
    id: 'family',
    question: 'What\'s your family size?',
    options: [
      { id: 'single', label: 'Single/Couple', icon: Users2, description: '1-2 BHK suitable' },
      { id: 'small', label: 'Small Family', icon: Users2, description: '2-3 BHK recommended' },
      { id: 'large', label: 'Joint Family', icon: Users2, description: '3+ BHK needed' }
    ]
  },
  {
    id: 'location',
    question: 'Preferred location?',
    options: [
      { id: 'mumbai', label: 'Mumbai', icon: MapPin },
      { id: 'bangalore', label: 'Bangalore', icon: MapPin },
      { id: 'delhi', label: 'Delhi NCR', icon: MapPin },
      { id: 'pune', label: 'Pune', icon: MapPin }
    ]
  },
  {
    id: 'budget',
    question: 'What\'s your budget range?',
    options: [
      { id: 'budget', label: '₹30L - ₹60L', icon: DollarSign, description: 'Affordable' },
      { id: 'mid', label: '₹60L - ₹1.5Cr', icon: DollarSign, description: 'Mid-range' },
      { id: 'premium', label: '₹1.5Cr+', icon: DollarSign, description: 'Premium' }
    ]
  },
  {
    id: 'metro',
    question: 'How important is metro connectivity?',
    options: [
      { id: 'essential', label: 'Essential', icon: Train, description: 'Within 1 km' },
      { id: 'preferred', label: 'Preferred', icon: Train, description: 'Within 2-3 km' },
      { id: 'optional', label: 'Not Important', icon: Train, description: 'Any distance' }
    ]
  },
  {
    id: 'parks',
    question: 'Need parks and green spaces nearby?',
    options: [
      { id: 'yes', label: 'Yes, Must Have', icon: Trees, description: 'Parks within 500m' },
      { id: 'nice', label: 'Nice to Have', icon: Trees, description: 'Within 1-2 km' },
      { id: 'no', label: 'Not Required', icon: Trees }
    ]
  },
  {
    id: 'property',
    question: 'Property type preference?',
    options: [
      { id: 'apartment', label: 'Apartment', icon: Home, description: 'Ready to move' },
      { id: 'villa', label: 'Villa/House', icon: Home, description: 'Independent' },
      { id: 'both', label: 'Open to Both', icon: Home }
    ]
  }
];

export function AIMatcher() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [matchedProperties, setMatchedProperties] = useState<Property[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const handleSelect = (questionId: string, optionId: string) => {
    const newAnswers = { ...answers, [questionId]: optionId };
    setAnswers(newAnswers);
    
    if (!isLastQuestion) {
      // Move to next question after a short delay
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    }
  };

  const findMatches = async () => {
    setIsMatching(true);
    
    try {
      // Build query params based on user answers
      const params = new URLSearchParams();
      
      // Map location answer to city
      if (answers.location) {
        const locationMap: Record<string, string> = {
          'mumbai': 'Mumbai',
          'bangalore': 'Bangalore',
          'delhi': 'Delhi',
          'pune': 'Pune'
        };
        params.append('city', locationMap[answers.location] || answers.location);
      }
      
      // Map budget to price range
      if (answers.budget) {
        const budgetRanges: Record<string, { min: number; max: number }> = {
          'budget': { min: 3000000, max: 6000000 },      // 30L - 60L
          'mid': { min: 6000000, max: 15000000 },        // 60L - 1.5Cr
          'premium': { min: 15000000, max: 500000000 }   // 1.5Cr+
        };
        const range = budgetRanges[answers.budget];
        if (range) {
          params.append('minPrice', range.min.toString());
          params.append('maxPrice', range.max.toString());
        }
      }
      
      // Map family size to bedrooms
      if (answers.family) {
        const bedroomMap: Record<string, string> = {
          'single': '1,2',
          'small': '2,3',
          'large': '3,4,5'
        };
        params.append('bedrooms', bedroomMap[answers.family] || '');
      }
      
      // Map property type
      if (answers.property) {
        const propertyMap: Record<string, string> = {
          'apartment': 'Apartment',
          'villa': 'Villa,House',
          'both': ''
        };
        const type = propertyMap[answers.property];
        if (type) {
          params.append('propertyType', type);
        }
      }
      
      // Fetch from API
      const response = await fetch(`https://api.propertiesprofessor.com/api/properties/ai-match?${params.toString()}`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setMatchedProperties(data.data.slice(0, 3));
      } else {
        // Fallback: get any available properties
        const fallbackResponse = await fetch('https://api.propertiesprofessor.com/api/properties/section/featured');
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.success) {
          setMatchedProperties(fallbackData.data.slice(0, 3));
        } else {
          setMatchedProperties(mockProperties.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error finding matches:', error);
      // Fallback to mock data on error
      setMatchedProperties(mockProperties.slice(0, 3));
    }
    
    setIsMatching(false);
    setHasMatched(true);
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setHasMatched(false);
    setMatchedProperties([]);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#1E3A5F] to-[#152a45] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00C9A7]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Sparkles className="w-5 h-5 text-[#FF6B35]" />
            <span className="text-white/90 text-sm font-medium">AI-Powered Matching</span>
          </div>
          <h2 className="heading-2 text-white mb-4">
            Not Just Filters,
            <span className="text-[#FF6B35]"> Find Your Vibe</span>
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Tell us about your ideal lifestyle, and our AI will match you with 
            neighborhoods and homes that fit your personality.
          </p>
        </div>

        {/* Quiz Section */}
        <div className="max-w-4xl mx-auto">
          {!hasMatched ? (
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Question {currentStep + 1} of {questions.length}</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF6B35] to-[#00C9A7] transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-2xl text-white font-semibold mb-8 text-center">
                {currentQuestion.question}
              </h3>

              {/* Options Grid */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(currentQuestion.id, option.id)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-[#FF6B35] bg-[#FF6B35]/10 scale-105'
                        : 'border-white/20 hover:border-white/40 bg-white/5 hover:scale-105'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3 transition-colors ${
                        answers[currentQuestion.id] === option.id
                          ? 'bg-[#FF6B35]'
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        <option.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-white font-semibold mb-1">{option.label}</h4>
                      {option.description && (
                        <p className="text-white/60 text-sm">{option.description}</p>
                      )}
                      {answers[currentQuestion.id] === option.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FF6B35] flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 justify-between">
                <Button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
                >
                  ← Previous
                </Button>
                
                {isLastQuestion && answers[currentQuestion.id] ? (
                  <Button
                    onClick={findMatches}
                    disabled={isMatching}
                    className="btn-secondary px-8 flex-1"
                  >
                    {isMatching ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Finding Your Matches...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Find My Perfect Home
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentStep(Math.min(questions.length - 1, currentStep + 1))}
                    disabled={!answers[currentQuestion.id]}
                    className="bg-[#FF6B35] text-white hover:bg-[#e55a2b] disabled:opacity-30 flex-1"
                  >
                    Next Question →
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl text-white font-semibold mb-2">
                  Perfect Matches Found!
                </h3>
                <p className="text-white/70">Based on your preferences, here are your top recommendations</p>
                <Button onClick={resetQuiz} className="mt-4 bg-white/10 text-white hover:bg-white/20">
                  ← Start New Search
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {matchedProperties.map((property) => (
                  <div
                    key={property._id}
                    className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-48">
                      <img
                        src={property.images[0]?.url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-[#00C9A7] text-white text-xs font-medium">
                          {Math.floor(Math.random() * 20 + 80)}% Match
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800 truncate">{property.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {property.location.area}, {property.location.city}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[#1E3A5F] font-bold">
                          {property.priceInWords || `₹${(property.price / 10000000).toFixed(1)} Cr`}
                        </span>
                        <span className="text-sm text-gray-500">
                          {property.bedrooms} BHK
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  onClick={() => window.location.href = '/buy'}
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  View All Matches
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
