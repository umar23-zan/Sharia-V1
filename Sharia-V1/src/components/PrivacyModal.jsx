import React, { useState } from 'react';
import { X, Shield, Lock, Eye, FileText, Database, Globe, UserCheck, Bell } from 'lucide-react';

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Helper component for policy sections
  const PolicySection = ({ title, icon, children }) => {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="pl-13 space-y-4 text-gray-600">
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" data-testid="privacy-modal">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold">Privacy Policy</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm mt-2 opacity-90">Last Updated: April 5, 2025</p>
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto p-6 max-h-[calc(90vh-80px)]">
            {/* Introduction */}
            <div className="space-y-4 text-gray-600 mb-8">
              <p>
                At ShariaStocks, accessible from shariastocks.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ShariaStocks and how we use it.
              </p>
              
              <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at privacy@shariastocks.in.
              </p>
              
              <p>
                This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in ShariaStocks. This policy is not applicable to any information collected offline or via channels other than this website.
              </p>
            </div>

            <PolicySection 
              title="Information We Collect" 
              icon={<Database className="w-5 h-5 text-indigo-600" />}
            >
              <p>
                When you register for an account, we may collect personally identifiable information, including but not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Your name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Financial information related to subscription payments</li>
                <li>Usage data and preferences</li>
              </ul>
              <p>
                We also collect information automatically when you visit our website, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages you visit and features you use</li>
                <li>Time spent on our platform</li>
                <li>Referring website addresses</li>
              </ul>
            </PolicySection>
            
            <PolicySection 
              title="How We Use Your Information" 
              icon={<Eye className="w-5 h-5 text-indigo-600" />}
            >
              <p>We use the information we collect for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>To provide, operate, and maintain our website and services</li>
                <li>To improve, personalize, and expand our website and services</li>
                <li>To understand and analyze how you use our website</li>
                <li>To develop new products, services, features, and functionality</li>
                <li>To communicate with you, including for customer service, updates, and marketing purposes</li>
                <li>To process payment transactions</li>
                <li>To find and prevent fraud</li>
                <li>For compliance with legal obligations</li>
              </ul>
            </PolicySection>
            
            <PolicySection 
              title="Data Security" 
              icon={<Lock className="w-5 h-5 text-indigo-600" />}
            >
              <p>
                The security of your personal information is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>
              <p>
                We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>All sensitive information is transmitted via Secure Socket Layer (SSL) technology</li>
                <li>All data is stored in secure databases with regular backups</li>
                <li>Access to personal information is restricted to authorized personnel only</li>
                <li>Regular security assessments and updates to our systems</li>
              </ul>
            </PolicySection>
            
            <PolicySection 
              title="Cookies and Tracking" 
              icon={<FileText className="w-5 h-5 text-indigo-600" />}
            >
              <p>
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
              <p>
                We use the following types of cookies:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Essential cookies:</strong> Required for the operation of our website</li>
                <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytical cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Marketing cookies:</strong> Allow us to deliver more relevant advertisements</li>
              </ul>
              <p>
                Our website may also use third-party analytics services like Google Analytics, which collect information about your use of the website and enable us to improve how it works.
              </p>
            </PolicySection>

            <PolicySection 
              title="Third-Party Disclosure" 
              icon={<Globe className="w-5 h-5 text-indigo-600" />}
            >
              <p>
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent except as described below:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Service providers:</strong> We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you</li>
                <li><strong>Legal requirements:</strong> We may disclose your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety</li>
                <li><strong>Business transfers:</strong> If ShariaStocks is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be transferred as part of that transaction</li>
              </ul>
              <p>
                Non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.
              </p>
            </PolicySection>

            <PolicySection 
              title="User Rights" 
              icon={<UserCheck className="w-5 h-5 text-indigo-600" />}
            >
              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Access:</strong> You can request copies of your personal information</li>
                <li><strong>Rectification:</strong> You can request that we correct inaccurate information</li>
                <li><strong>Erasure:</strong> You can request that we delete your personal information</li>
                <li><strong>Restriction:</strong> You can request that we restrict the processing of your information</li>
                <li><strong>Data portability:</strong> You can request a copy of your information in a machine-readable format</li>
                <li><strong>Objection:</strong> You can object to our processing of your information</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at privacy@shariastocks.in. We will respond to your request within 30 days.
              </p>
            </PolicySection>

            <PolicySection 
              title="Changes to This Policy" 
              icon={<Bell className="w-5 h-5 text-indigo-600" />}
            >
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
              <p>
                Your continued use of our website after we post any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.
              </p>
            </PolicySection>

            <PolicySection 
              title="Compliance with Shariah Principles" 
              icon={<Shield className="w-5 h-5 text-indigo-600" />}
            >
              <p>
                As a Shariah-compliant platform, we are committed to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Transparency in all data collection and processing practices</li>
                <li>Ethical handling of user information in accordance with Islamic principles</li>
                <li>Obtaining clear consent before collecting or sharing sensitive information</li>
                <li>Never using personal data for exploitative or harmful purposes</li>
              </ul>
              <p>
                Our Shariah Advisory Board regularly reviews our privacy practices to ensure they align with Islamic ethical standards.
              </p>
            </PolicySection>

            {/* Contact Section */}
            <div className="mt-8 bg-indigo-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="mb-3">
                If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
              </p>
              <p><strong>Email:</strong> contact@shariastocks.in</p>
            </div>

            {/* Footer with close button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrivacyModal