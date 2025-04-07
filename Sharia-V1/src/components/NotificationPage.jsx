import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronRight, ArrowLeft, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`/api/notifications?userId=${userId}&type=${activeTab}`);
      setNotifications(response.data);
      console.log(notifications)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleNotificationClick = async (notification) => {
    
    try {
      // Mark notification as read
      await axios.post(`/api/notifications/read/${notification.id}`);
      
      // Update local state to show it's read
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
      
      // Navigate to the article URL if available, otherwise fallback to stock page
      if (notification.articleUrl) {
        window.open(notification.articleUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback to stock page if no article URL
        window.location.href = `/stocks/${notification.symbol}`;
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation(); // Prevent the notification click event from firing
    
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      // Remove the notification from state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (!searchTerm) return true;
    return notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           notification.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (notification.description && notification.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Calculate notification counts
  const notificationCounts = {
    all: notifications.length,
    haram: notifications.filter(n => n.type === 'haram').length,
    uncertain: notifications.filter(n => n.type === 'uncertain').length
  };

  // Tab configurations
  const tabConfig = [
    { id: 'all', label: 'All Notifications', icon: <Bell size={20} />, mobileLabel: 'All' },
    { 
      id: 'haram', 
      label: 'Haram Stocks', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      mobileLabel: 'Haram'
    },
    { 
      id: 'uncertain', 
      label: 'Uncertain Stocks', 
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      mobileLabel: 'Uncertain'
    }
  ];

  return (
    <div>
      <div className="hidden lg:block">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 px-4 py-8 shadow-sm flex items-center justify-between mb-6">
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Bell size={22} className="text-white" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {notifications.filter(n => !n.isRead).length}
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
              {notifications.filter(n => !n.isRead).length}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="relative flex items-center mb-4">
          <div className="absolute left-3 text-white/70">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search notifications..." 
            className="pl-10 pr-4 py-2 border bg-white/20 text-white rounded-lg w-full text-sm focus:outline-none focus:ring-1 focus:ring-white/30 placeholder-white/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`bg-white rounded-lg shadow-sm mb-4 overflow-hidden relative ${
                  !notification.isRead ? 'border-l-4 border-blue-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Delete button - positioned absolutely */}
                <button 
                  onClick={(e) => handleDeleteNotification(e, notification.id)}
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition z-10"
                  aria-label="Delete notification"
                >
                  <X size={16} />
                </button>

                <div className="p-4 flex items-start justify-between cursor-pointer hover:bg-gray-50">
                 
                  <div className="flex">
                    {notification.type === 'haram' && (
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#EF4444">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    {notification.type === 'uncertain' && (
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#D97706">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}

                    <div className="flex-1 pr-6"> {/* Added padding-right to avoid overlap with delete button */}
                      <h3 className="text-gray-900 font-medium">{notification.title}</h3>
                      <div className="mt-1">
                        <span className="text-blue-500 font-medium">{notification.symbol}</span>
                      </div>
                      {notification.description && (
                        <p className="text-gray-700 mt-1 text-sm line-clamp-2 overflow-hidden text-ellipsis">
                          {notification.description}
                        </p>
                      )}
                      {notification.status && (
                        <div className={`${notification.statusBg} ${notification.statusText} text-sm py-1 px-3 rounded-md mt-2 inline-block`}>
                          {notification.status}
                        </div>
                      )}
                      {notification.status === "UNDER REVIEW" && (
                        <p className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
                          Our AI model has found something concerning about this stock. Our team is reviewing it and will update the status within 48 hours.
                        </p>
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
                      
                      {/* Violations list */}
                      {notification.violations && notification.violations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Key Violations:</h4>
                          <ul className="text-xs text-gray-600 list-disc pl-4">
                            {notification.violations.map((violation, index) => (
                              <li key={index}>{violation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <ChevronRight size={20} className="text-gray-400" /> */}
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
                We'll notify you when stocks in your watchlist are classified as {activeTab !== 'all' ? activeTab : 'HARAM or UNCERTAIN'}.
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