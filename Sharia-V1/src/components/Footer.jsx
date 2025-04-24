import React from 'react'
import logo from '../images/ShariaStocks-logo/logo1.jpeg';

const Footer = () => {
  return (
    <div>
      <footer className="mt-16 text-center text-gray-500 text-sm border-t border-gray-100 pt-6 px-4">
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
                  {['About', 'Privacy', 'Terms', 'Blogs', 'FAQ'].map((item, index) => (
                    <a key={index} href={`/${item.toLowerCase()}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 pb-8">
                <p>© 2025 Zansphere Private Limited. All rights reserved.</p>
              </div>
            </div>
          </footer>
    </div>
  )
}

export default Footer