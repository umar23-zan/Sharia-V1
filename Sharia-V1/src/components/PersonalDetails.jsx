import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Camera, Plus, Trash2 } from 'lucide-react';
import DeactivateAccount from './DeactivateAccount'
import Header from './Header';

const PersonalDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;
  console.log(user)
  const userEmail = localStorage.getItem('userEmail')
  const [deactivated, setDeactivated] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleDeactivationSuccess = () => {
    setDeactivated(true);
    console.log("Account deactivated correctly");
    localStorage.clear();
    navigate('/signup');
  };

  if (deactivated) {
    return <div>Account deactivated successfully.</div>;
  }

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
                  <span className="text-gray-600">Deactivate Account</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm cursor-pointer" onClick={() => setShowDeactivateModal(true)}>
                    Deactivate
                  </span>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
      {showDeactivateModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <DeactivateAccount
              userEmail={userEmail}
              onDeactivationSuccess={handleDeactivationSuccess}
              onCancel={() => setShowDeactivateModal(false)}
            />
            
          </div>
        </div>
      )}
    </div>
  );
};
export default PersonalDetails