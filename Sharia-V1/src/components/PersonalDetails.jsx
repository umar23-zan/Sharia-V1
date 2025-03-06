import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera, Plus, Trash2 } from 'lucide-react';
import logo from '../images/ShariaStocks-logo/logo1.jpeg'
import account from '../images/account-icon.svg';
import Header from './Header';

const PersonalDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div className="max-w-7xl mx-auto min-h-screen ">
      <Header />
      <div className="max-w-7xl mx-auto">
        <div className="p-4 flex items-center gap-4">
          <ArrowLeft 
            className="w-6 h-6 text-gray-600 cursor-pointer" 
            onClick={() => navigate(-1)} 
          />
          <h1 className="text-xl font-semibold">Personal Details</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Account Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">January 2024</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Account Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-sm">Active</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Two-Factor Auth</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm">Disabled</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates and alerts via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Get instant alerts via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <button className="w-80 py-2.5 px-4 bg-blue-600  text-white rounded-xl hover:bg-blue-700 transition-colors">
              Update Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PersonalDetails