import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const styles = `
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
`;

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate()
  
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const notifications = [
    {
      type: 'price',
      icon: '📈',
      iconBg: 'bg-emerald-500',
      title: 'Price Target Reached',
      symbol: '$AAPL',
      price: '182.31',
      change: '+5.2%',
      time: '2 min ago',
      changeColor: 'text-emerald-500'
    },
    {
      type: 'status',
      icon: '🛡️',
      iconBg: 'bg-orange-400',
      title: 'Status Change Alert',
      symbol: '$MSFT',
      description: 'Recent acquisition increases debt ratio above threshold',
      status: 'Doubtful',
      statusBg: 'bg-yellow-100',
      statusText: 'text-yellow-800',
      detail: 'Debt-to-equity ratio exceeds permissible limits',
      time: '1h ago'
    },
    {
      type: 'news',
      icon: '⭐',
      iconBg: 'bg-blue-500',
      title: 'Breaking News',
      symbol: '$AMZN',
      description: 'New interest-based financial services launch',
      status: 'Haram',
      statusBg: 'bg-red-100',
      statusText: 'text-red-800',
      detail: 'Core business now includes impermissible financial products',
      time: '3h ago',
      source: 'Financial Times'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Notifications', count: 12, icon: '🔔' },
    { id: 'price', label: 'Price Alerts', count: 5, icon: '📈' },
    { id: 'status', label: 'Status Changes', count: 3, icon: '🛡️' },
    { id: 'news', label: 'Market News', count: 4, icon: '⭐' }
  ];

  // Mobile tab data with shorter labels
  const mobileTabs = [
    { id: 'all', label: 'All', count: 12, icon: '🔔' },
    { id: 'price', label: 'Price', count: 5, icon: '📈' },
    { id: 'status', label: 'Status', count: 3, icon: '🛡️' },
    { id: 'news', label: 'News', count: 4, icon: '⭐' }
  ];

  return (
    <div className=" bg-white lg:bg-gray-50">
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition mr-3"> {/* Back Button */}
                  <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              <p className="text-white/80">Stay informed about your investments</p>
            </div>
            <div className="relative">
              <button className="p-2 rounded-lg bg-white/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </div>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="flex gap-2 w-max min-w-full">
              {mobileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-white/10 text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span className="text-sm">{tab.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Notifications */}
        <div className="p-4 space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex gap-4">
                <div className={`w-12 h-12 ${notification.iconBg} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0`}>
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate">{notification.title}</h3>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="mt-1">
                    <span className="text-blue-600">{notification.symbol}</span>
                    {notification.price && (
                      <span className="ml-2">
                        ${notification.price}{' '}
                        <span className={notification.changeColor}>{notification.change}</span>
                      </span>
                    )}
                  </div>
                  {notification.description && (
                    <p className="text-gray-600 mt-1">{notification.description}</p>
                  )}
                  {notification.status && (
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${notification.statusBg} ${notification.statusText}`}>
                        {notification.status}
                      </span>
                      <p className="text-gray-500 text-sm mt-1">{notification.detail}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {notification.time}
                    {notification.source && (
                      <>
                        <span>•</span>
                        <span>{notification.source}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-72 border-r min-h-screen p-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/20 text-black hover:bg-white/20 transition mr-3"> {/* Back Button */}
              <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold mb-1">Notifications</h1>
          <p className="text-gray-500 mb-6">Stay informed about your investments</p>
          
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg ${
                  activeTab === tab.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Desktop Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">
              {tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  3
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Notifications */}
          <div className="p-6 space-y-4">
            {notifications.map((notification, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 ${notification.iconBg} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0`}>
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="mt-1">
                      <span className="text-blue-600">{notification.symbol}</span>
                      {notification.price && (
                        <span className="ml-2">
                          ${notification.price}{' '}
                          <span className={notification.changeColor}>{notification.change}</span>
                        </span>
                      )}
                    </div>
                    {notification.description && (
                      <p className="text-gray-600 mt-1">{notification.description}</p>
                    )}
                    {notification.status && (
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded-full text-sm ${notification.statusBg} ${notification.statusText}`}>
                          {notification.status}
                        </span>
                        <p className="text-gray-500 text-sm mt-1">{notification.detail}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {notification.time}
                      {notification.source && (
                        <>
                          <span>•</span>
                          <span>{notification.source}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;