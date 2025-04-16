import React, { Suspense, useEffect, useState } from 'react';
import { ArrowLeft, Users, BookOpen, Award, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import logo from '../images/ShariaStocks-logo/logo1.jpeg';

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>About ShariaStocks | Islamic Investing in India</title>
        <meta
          name="description"
          content="Learn about ShariaStocks' mission to provide Shariah-compliant stock analysis and ethical investment options in the Indian market."
        />
        <meta name="keywords" content="About ShariaStocks, Islamic Finance, Halal Investing, Ethical Investment, Indian Stock Market" />
        <link rel="canonical" href="https://shariastocks.in/about" />
      </Helmet>

      <Suspense fallback={<div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>}>
        
        
        <main className="max-w-6xl mx-auto px-4 pt-8 pb-16">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link to="javascript:void(0)" onClick={() => navigate(-1)} className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium text-sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </div>

          {/* Hero Section */}
          <section className="relative rounded-2xl overflow-hidden mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="relative z-10 py-12 px-6 md:px-12 text-center text-white">
              <div className="flex justify-center mb-6">
                <img 
                  src={logo} 
                  alt="ShariaStocks Logo" 
                  className="h-20 rounded-full border-4 border-white/20 shadow-lg"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/80x80?text=Logo" }}
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About ShariaStocks</h1>
              <p className="max-w-2xl mx-auto text-lg opacity-90">
                Empowering Muslims in India with Shariah-compliant investment solutions to build wealth without compromising faith.
              </p>
            </div>
          </section>

          {/* Our Mission Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Our Mission</h2>
              
              <div className="space-y-6 text-gray-600">
                <p>
                  At ShariaStocks, we are dedicated to bridging the gap between Islamic principles and modern investing in the Indian stock market. We understand the challenges faced by Muslim investors who wish to grow their wealth while adhering to Shariah principles, particularly the avoidance of interest (riba), excessive uncertainty (gharar), and investments in prohibited industries.
                </p>
                
                <p>
                  Our mission is to democratize access to Shariah-compliant investment knowledge through cutting-edge technology and expert analysis. We provide investors with the tools and information needed to make informed decisions that align with both their financial goals and religious values.
                </p>
                
                <p>
                  We believe that ethical investing shouldn't come at the cost of financial returns. By focusing on thorough financial analysis and rigorous Shariah screening, we help our users identify investment opportunities that are both morally sound and financially promising.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Our Values</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                    <p className="text-gray-600">
                      We maintain strict adherence to Islamic financial principles in all our analysis and recommendations, ensuring transparency in our methodology and decision-making processes.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Education</h3>
                    <p className="text-gray-600">
                      We believe in empowering our community through knowledge, helping users understand both the principles of Islamic finance and the fundamentals of sound investing.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                    <p className="text-gray-600">
                      We strive for excellence in our analysis, continuously refining our screening methodology and staying updated with the latest developments in both financial markets and Islamic finance.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Community</h3>
                    <p className="text-gray-600">
                      We're building a community of like-minded investors who support each other in the journey toward financial freedom while honoring religious commitments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Our Story</h2>
              
              <div className="space-y-6 text-gray-600">
                <p>
                  ShariaStocks was founded in 2023 by a team of Muslim finance professionals who experienced firsthand the challenges of investing in accordance with Islamic principles in the Indian market. Frustrated by the lack of accessible resources and tools for Shariah-compliant stock analysis, they decided to create a solution that would make ethical investing accessible to all Muslims in India.
                </p>
                
                <p>
                  Starting with a small database of manually screened stocks, the founding team developed a comprehensive methodology for evaluating companies based on both financial performance and Shariah compliance. As the platform grew, so did our technology and expertise, allowing us to offer increasingly sophisticated analysis and a broader range of services.
                </p>
                
                <p>
                  Today, ShariaStocks serves thousands of Muslim investors across India, from beginners taking their first steps into the stock market to experienced investors managing substantial portfolios. We continue to innovate and expand our offerings, guided by our commitment to helping our community achieve financial success while honoring their faith.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-12">
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Our Expert Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Ahmed Khan",
                    role: "Founder & CEO",
                    bio: "Former investment banker with 15+ years experience in equity markets and Islamic finance.",
                    image: "/api/placeholder/80/80"
                  },
                  {
                    name: "Fatima Zaidi",
                    role: "Chief Research Officer",
                    bio: "CFA charterholder specializing in fundamental analysis and Shariah compliance screening.",
                    image: "/api/placeholder/80/80"
                  },
                  {
                    name: "Mohammad Rizwan",
                    role: "Shariah Advisor",
                    bio: "Islamic scholar with expertise in fiqh al-muamalat (Islamic commercial jurisprudence).",
                    image: "/api/placeholder/80/80"
                  }
                ].map((member, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-16 h-16 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{member.name}</h3>
                        <p className="text-indigo-600 text-sm">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Us */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Contact Us</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6 text-gray-600">
                  <p>
                    We value your feedback and are here to answer any questions you may have about ShariaStocks and our services. Feel free to reach out to us through any of the following channels:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">contact@shariastocks.in</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                          <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 5v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">+91 98765 43210</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Address</div>
                        <div className="font-medium">123 Finance Street, Mumbai, Maharashtra 400001</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Send us a message</h3>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your email"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        id="message"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm border-t border-gray-100 pt-6 pb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="mb-4 md:mb-0">
                <img 
                  src={logo} 
                  alt="ShariaStocks Logo" 
                  className="h-10 mx-auto md:mx-0" 
                  onError={(e) => { e.target.src = "https://via.placeholder.com/40x40?text=Logo" }}
                />
              </div>
              
              <div className="flex space-x-4">
                {['About', 'Privacy', 'Terms'].map((item, index) => (
                  <Link key={index} to={`/${item.toLowerCase()}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <p>© 2025 Zansphere. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </Suspense>
    </div>
  );
};

export default About;