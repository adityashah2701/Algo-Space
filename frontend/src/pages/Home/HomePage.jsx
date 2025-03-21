import React, { useState } from 'react';
import { 
  Zap, 
  Globe, 
  Users, 
  TrendingUp, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Briefcase,
  MapPin,
  Award
} from 'lucide-react';

const HomePage= () => {
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // const platformHighlights = [
  //   {
  //     icon: <Zap className="w-12 h-12 text-blue-500" />,
  //     value: '500+',
  //     label: 'Job Categories',
  //     description: 'Diverse opportunities across industries'
  //   },
  //   {
  //     icon: <CheckCircle className="w-12 h-12 text-green-500" />,
  //     value: '98%',
  //     label: 'Match Accuracy',
  //     description: 'Precision-driven job recommendations'
  //   },
  //   {
  //     icon: <Users className="w-12 h-12 text-purple-500" />,
  //     value: '10k+',
  //     label: 'Active Users',
  //     description: 'Growing professional community'
  //   },
  //   {
  //     icon: <TrendingUp className="w-12 h-12 text-yellow-500" />,
  //     value: '$2.5B',
  //     label: 'Total Opportunities',
  //     description: 'Vast career potential'
  //   }
  // ];

  const jobFeatures = [
    {
      icon: <Globe className="w-10 h-10 text-blue-500" />,
      title: 'Global Opportunities',
      description: 'Discover jobs from around the world, breaking geographical barriers'
    },
    {
      icon: <Award className="w-10 h-10 text-green-500" />,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms connect you with perfectly aligned roles'
    },
    {
      icon: <Briefcase className="w-10 h-10 text-purple-500" />,
      title: 'Career Intelligence',
      description: 'Insights that help you make informed career decisions'
    }
  ];

  const testimonials = [
    {
      name: 'Emily Rodriguez',
      role: 'Senior Tech Recruiter',
      quote: 'CareerAI has transformed our talent acquisition strategy. The depth of insights is unparalleled.',
      avatar: '/api/placeholder/80/80'
    },
    {
      name: 'Michael Chen',
      role: 'Career Development Specialist',
      quote: 'Never before have I seen such precise job-skill matching. It\'s like having a career coach and recruiter in one platform.',
      avatar: '/api/placeholder/80/80'
    }
  ];

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
  };

  const handleJobSearch = (e) => {
    e.preventDefault();
    console.log('Job search:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1416] to-[#1A2B3C] text-white">
      {/* Hero Section */}
     <div className="container mx-auto px-4 md:px-8 lg:px-12 pt-16 pb-16 relative flex items-center">
  <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-blue-900/20 to-purple-900/20 -z-10 opacity-50 blur-3xl"></div>
  
  <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
    <div>
      <h1 className="text-7xl md:text-5xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
        Unlock Your Career Potential
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-10">
        Leverage AI-driven insights to discover, match, and excel in your dream career. We don't just find jobs, we craft professional journeys.
      </p>
      
      <form className=" backdrop-blur-md rounded-xl p-2 flex flex-col md:flex-row justify-center items-center w-full">
        <div className="relative flex-grow mr-0 md:mr-2 mb-2 md:mb-0 w-full">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <input 
            type="text"
            placeholder="Job title, skills, or company"
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative flex-grow mr-0 md:mr-2 mb-2 md:mb-0 w-full">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <input 
            type="text"
            placeholder="Location or 'Remote'"
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-2 w-full rounded-lg hover:bg-blue-700 transition flex items-center justify-center w-full md:w-auto"
        >
          Find Jobs
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </form>
    </div>
    
    <div className="hidden md:block">
      <div className="backdrop-blur-md p-6 ml-3">
        <img 
          src="/img1.png" 
          alt="Career Insights Visualization" 
          className="rounded-xl transform hover:scale-105 transition duration-300 w-full"
        />
      </div>
    </div>
  </div>
</div>
      {/* Platform Highlights */}
      <div className="w-full py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Stat Card 1 */}
      <div className="bg-gray-800/70 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col items-center text-center">
        <div className="bg-blue-500/10 p-3 rounded-lg mb-4">
          <svg className="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h3 className="text-4xl font-bold text-blue-400 mb-1">500<span className="text-blue-500">+</span></h3>
        <h4 className="text-lg font-medium text-gray-300 mb-2">Job Categories</h4>
        <p className="text-gray-400 text-sm">Diverse opportunities across industries</p>
      </div>
      
      {/* Stat Card 2 */}
      <div className="bg-gray-800/70 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 flex flex-col items-center text-center">
        <div className="bg-green-500/10 p-3 rounded-lg mb-4">
          <svg className="w-8 h-8 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-4xl font-bold text-blue-400 mb-1">98<span className="text-green-500">%</span></h3>
        <h4 className="text-lg font-medium text-gray-300 mb-2">Match Accuracy</h4>
        <p className="text-gray-400 text-sm">Precision-driven job recommendations</p>
      </div>
      
      {/* Stat Card 3 */}
      <div className="bg-gray-800/70 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 flex flex-col items-center text-center">
        <div className="bg-purple-500/10 p-3 rounded-lg mb-4">
          <svg className="w-8 h-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 className="text-4xl font-bold text-blue-400 mb-1">10k<span className="text-purple-500">+</span></h3>
        <h4 className="text-lg font-medium text-gray-300 mb-2">Active Users</h4>
        <p className="text-gray-400 text-sm">Growing professional community</p>
      </div>
      
      {/* Stat Card 4 */}
      <div className="bg-gray-800/70 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 flex flex-col items-center text-center">
        <div className="bg-yellow-500/10 p-3 rounded-lg mb-4">
          <svg className="w-8 h-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        </div>
        <h3 className="text-4xl font-bold text-blue-400 mb-1">$2.5<span className="text-yellow-500">B</span></h3>
        <h4 className="text-lg font-medium text-gray-300 mb-2">Total Opportunities</h4>
        <p className="text-gray-400 text-sm">Vast career potential</p>
      </div>
      
    </div>
  </div>
</div>

      {/* Job Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Why Choose Algo Space?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {jobFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center hover:bg-white/20 transition transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Success Stories
        </h2>
        <div className="flex justify-center space-x-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-96 hover:bg-white/20 transition transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-6">
                <img 
                  src="/image.png"
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 border-2 border-blue-500"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-white/70 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Join thousands of professionals who've found their perfect career path with CareerAI
          </p>
          <form onSubmit={handleEmailSubmit} className="max-w-xl mx-auto flex">
            <input 
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-6 py-4 rounded-l-lg bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-white text-blue-600 px-8 py-4 rounded-r-lg hover:bg-gray-100 transition flex items-center"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

    </div>
  );
};

export default HomePage;