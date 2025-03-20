import React, { useState } from 'react';
import { Search, Bell, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import Header from './Header';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  
  const notifications = [];

  const handleBackClick = () => {
    
    window.history.back();
  };


  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    return notification.type === activeTab;
  });

  // Calculate notification counts
  const notificationCounts = {
    all: notifications.length,
    price: notifications.filter(n => n.type === 'price').length,
    status: notifications.filter(n => n.type === 'status').length,
    news: notifications.filter(n => n.type === 'news').length
  };

  // Tab configurations
  const tabConfig = [
    { id: 'all', label: 'All Notifications', icon: <Bell size={20} />, mobileLabel: 'All' },
    { 
      id: 'price', 
      label: 'Price Alerts', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
          <path d="M3 3v18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 9l-5-5-4 4-3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      mobileLabel: 'Price'
    },
    { 
      id: 'status', 
      label: 'Status Changes', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      mobileLabel: 'Status'
    },
    { 
      id: 'news', 
      label: 'Market News', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      mobileLabel: 'News'
    }
  ];

  return (
    <div>
      
      {/* Desktop View Header - Using the same gradient */}
      <div className="hidden lg:block">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-8  shadow-sm flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={handleBackClick}
              className="mr-4 p-2 rounded-full hover:bg-white/10 text-white transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Notifications</h1>
              <p className="text-white/80 text-sm">Stay informed about your investments</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-600">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search notifications..." 
                className="pl-10 pr-4 py-2 border bg-white/90 rounded-full w-64 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200"
              />
            </div>
            <div className="relative">
              <Bell size={22} className="text-white" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                0
              </div>
            </div>
          </div>
        </div>
      </div>
    <div className="w-full max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-br from-blue-600 to-purple-600 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition mr-3" onClick={handleBackClick}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="text-white/80">Stay informed about your investments</p>
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              0
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 w-max min-w-full">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-white/10 text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.mobileLabel}</span>
                <span className="text-sm">{notificationCounts[tab.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:p-4 gap-4">
        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:block w-64 bg-white rounded-lg shadow-sm p-2 h-fit">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center w-full p-3 rounded-lg ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="w-8 h-8 flex items-center justify-center text-blue-600 mr-3">
                {tab.icon}
              </span>
              <div className="flex flex-col items-start">
                <span className="font-medium">{tab.label}</span>
                <span className="text-sm text-gray-500">{notificationCounts[tab.id]} notifications</span>
              </div>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 px-4 lg:px-0">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                <div className="p-4 flex items-start justify-between cursor-pointer">
                  {/* Icon based on notification type */}
                  <div className="flex">
                    {notification.type === 'price' && (
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#10B981">
                          <path d="M3 3v18h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 9l-5-5-4 4-3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    {notification.type === 'status' && (
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#D97706">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    {notification.type === 'news' && (
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#EF4444">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="text-gray-900 font-medium">{notification.title}</h3>
                      <div className="mt-1">
                        <span className="text-blue-500 font-medium">{notification.symbol}</span>
                        {notification.change && (
                          <span className={`ml-2 ${notification.changeColor}`}>{notification.change}</span>
                        )}
                      </div>
                      {notification.description && (
                        <p className="text-gray-700 mt-1 text-sm">{notification.description}</p>
                      )}
                      {notification.status && (
                        <div className={`${notification.statusBg} ${notification.statusText} text-sm py-1 px-3 rounded-md mt-2 inline-block`}>
                          {notification.status}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            ))
          ) : (
            // Empty state
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                You don't have any {activeTab !== 'all' ? activeTab : ''} notifications at the moment. 
                We'll notify you when there are updates to your investments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotificationsPage;