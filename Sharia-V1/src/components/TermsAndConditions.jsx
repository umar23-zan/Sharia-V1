import React, { Suspense, useEffect, useState } from 'react';
import { ArrowLeft, Shield, Scale, FileText, CreditCard, AlertCircle, Clock, Globe, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Footer from './Footer';



const TermsAndConditions = () => {
const navigate = useNavigate();

  // Helper component for terms sections
  const TermsSection = ({ title, icon, children }) => {
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
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>Terms and Conditions | ShariaStocks</title>
        <meta
          name="description"
          content="ShariaStocks' terms and conditions outline the rules, guidelines, and responsibilities for using our Shariah-compliant stock analysis platform."
        />
        <meta name="keywords" content="Terms and Conditions, ShariaStocks Terms, User Agreement, Legal Terms" />
        <link rel="canonical" href="https://shariastocks.in/terms" />
      </Helmet>

      <Suspense fallback={<div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>}>
        
        
        <main className="max-w-5xl mx-auto px-4 pt-8 pb-16">
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
            
            <div className="relative z-10 py-10 px-6 md:px-12 text-center text-white">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-3">Terms and Conditions</h1>
              <p className="max-w-2xl mx-auto opacity-90">
                Please read these terms carefully before using our platform. They define your rights and obligations as a user of ShariaStocks.
              </p>
              <p className="text-sm mt-4 opacity-75">Last Updated: April 5, 2025</p>
            </div>
          </section>

          {/* Introduction */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="p-8">
              <div className="space-y-4 text-gray-600">
                <p>
                  Welcome to ShariaStocks. These Terms and Conditions ("Terms") govern your use of the ShariaStocks website (https://shariastocks.in) and all related services, features, content, and applications (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
                </p>
                
                <p>
                  Please read these Terms carefully before using our Service. If you do not agree with any part of these Terms, you must not use our Service. Your access to and use of the Service is also conditioned on your acceptance of and compliance with our Privacy Policy.
                </p>
                
                <p>
                  The Service is owned and operated by ShariaStocks ("we," "us," or "our"). We reserve the right to modify, amend, or change these Terms at any time. We will notify you of any changes by posting the updated Terms on this page and updating the "Last Updated" date. Your continued use of the Service after such modifications will constitute your acknowledgment and acceptance of the modified Terms.
                </p>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div className="p-8">
              <TermsSection 
                title="User Accounts" 
                icon={<Shield className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  To access certain features of the Service, you may be required to create a user account. When you create an account, you must provide accurate, current, and complete information. You are responsible for:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>Restricting access to your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use of your account</li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate your account if you violate any provision of these Terms or if we suspect any fraudulent, abusive, or illegal activity associated with your account.
                </p>
              </TermsSection>
              
              <TermsSection 
                title="Subscription and Payments" 
                icon={<CreditCard className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  ShariaStocks offers various subscription plans to access premium features and content. By subscribing to our Service, you agree to the following:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You will be charged according to your selected subscription plan</li>
                  <li>Subscription fees are non-refundable except as expressly provided in these Terms</li>
                  <li>Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing period</li>
                  <li>You may cancel your subscription at any time through your account settings</li>
                </ul>
                <p>
                  All payments are processed through secure third-party payment processors. We do not store your complete payment information on our servers. By providing payment information, you represent that you are authorized to use the payment method and agree to the terms of the payment processor.
                </p>
                <p>
                  In accordance with Shariah principles, we do not charge or pay interest (riba). Our subscription model is based on providing a service for a fixed fee.
                </p>
              </TermsSection>
              
              <TermsSection 
                title="Content and Intellectual Property" 
                icon={<FileText className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  The Service contains content owned or licensed by ShariaStocks, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and data compilations. All such content is protected by intellectual property laws.
                </p>
                <p>
                  You are granted a limited, non-exclusive, non-transferable license to access and use the content solely for your personal, non-commercial use. You may not:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any content obtained from the Service</li>
                  <li>Use data mining, robots, or similar data gathering methods</li>
                  <li>Download or copy account information for the benefit of another merchant</li>
                  <li>Use any content in any way that might infringe any copyright, intellectual property right, or proprietary right</li>
                </ul>
              </TermsSection>
              
              <TermsSection 
                title="Disclaimer of Warranties" 
                icon={<AlertCircle className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  The Service is provided on an "as is" and "as available" basis. ShariaStocks makes no representations or warranties of any kind, express or implied, regarding the operation of the Service or the information, content, materials, or products included on the Service.
                </p>
                <p>
                  To the fullest extent permissible by applicable law, ShariaStocks disclaims all warranties, express or implied, including but not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Implied warranties of merchantability and fitness for a particular purpose</li>
                  <li>Warranties regarding security, accuracy, reliability, timeliness, and performance of the Service</li>
                  <li>Warranties relating to the accuracy or completeness of stock information and analysis</li>
                </ul>
                <p>
                  ShariaStocks does not warrant that the Service will meet your requirements, that operation of the Service will be uninterrupted or error-free, or that defects in the Service will be corrected.
                </p>
              </TermsSection>

              <TermsSection 
                title="Financial Information and Advice" 
                icon={<Scale className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  ShariaStocks provides information about stocks and investments that we believe comply with Shariah principles. However:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The information provided is for educational and informational purposes only and should not be considered financial advice</li>
                  <li>Our Shariah compliance determinations are based on our understanding and interpretation of Islamic principles, which may differ from other authorities</li>
                  <li>Past performance is not indicative of future results</li>
                  <li>All investments involve risk, and the value of your investments may fluctuate</li>
                </ul>
                <p>
                  You should consult with a qualified financial advisor, tax professional, and religious authority before making any investment decisions. You agree that ShariaStocks will not be liable for any losses or damages resulting from your reliance on information obtained through our Service.
                </p>
              </TermsSection>

              <TermsSection 
                title="Limitation of Liability" 
                icon={<Shield className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  To the fullest extent permitted by applicable law, ShariaStocks and its affiliates, officers, directors, employees, agents, and licensors shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Damages for loss of profits, goodwill, use, data, or other intangible losses</li>
                  <li>Damages resulting from unauthorized access to or alteration of your transmissions or data</li>
                  <li>Damages related to any investment decisions made based on information provided through the Service</li>
                  <li>Any other damages arising out of or in connection with the use or inability to use the Service</li>
                </ul>
                <p>
                  This limitation applies whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis, and even if ShariaStocks has been advised of the possibility of such damage.
                </p>
              </TermsSection>

              <TermsSection 
                title="Term and Termination" 
                icon={<Clock className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  These Terms remain in full force and effect while you use the Service. ShariaStocks reserves the right, at its sole discretion, to:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Terminate your access to the Service immediately, without prior notice or liability, for any reason</li>
                  <li>Discontinue providing the Service or any part thereof with or without notice</li>
                  <li>Delete or remove your account and all related information and files</li>
                  <li>Bar any further access to such files or the Service</li>
                </ul>
                <p>
                  Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                </p>
              </TermsSection>

              <TermsSection 
                title="Governing Law and Dispute Resolution" 
                icon={<Globe className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any dispute arising out of or relating to these Terms or the Service shall first be resolved through good-faith negotiations. If such negotiations fail, the dispute shall be submitted to binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 of India. The arbitration shall take place in Mumbai, Maharashtra, India, and the language of arbitration shall be English.
                </p>
                <p>
                  You agree that any arbitration shall be conducted on an individual basis and not in a class, consolidated, or representative action. Any claim must be brought within one (1) year after the cause of action arises, or such claim or cause of action is barred.
                </p>
              </TermsSection>

              <TermsSection 
                title="Shariah Compliance" 
                icon={<Shield className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  As a Shariah-compliant platform, we adhere to the following principles:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>We strive to identify investments that comply with Islamic principles, avoiding industries involving alcohol, gambling, conventional banking, and other prohibited activities</li>
                  <li>We aim to provide transparent, fair, and ethical services</li>
                  <li>Our business operations avoid interest-based transactions (riba)</li>
                  <li>We avoid excessive uncertainty (gharar) in our business practices</li>
                </ul>
                <p>
                  Our Shariah Advisory Board reviews our practices to ensure compliance with Islamic principles. However, individual users are ultimately responsible for making their own determinations regarding the Shariah compliance of specific investments based on their personal understanding and interpretation of Islamic principles.
                </p>
              </TermsSection>

              <TermsSection 
                title="Miscellaneous Provisions" 
                icon={<FileText className="w-5 h-5 text-indigo-600" />}
              >
                <p>
                  <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and ShariaStocks regarding the Service and supersede all prior agreements and understandings.
                </p>
                <p>
                  <strong>Severability:</strong> If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will continue in full force and effect.
                </p>
                <p>
                  <strong>Waiver:</strong> The failure of ShariaStocks to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.
                </p>
                <p>
                  <strong>Assignment:</strong> You may not assign these Terms or any rights or obligations hereunder without the prior written consent of ShariaStocks. ShariaStocks may assign these Terms without restriction.
                </p>
                <p>
                  <strong>Force Majeure:</strong> ShariaStocks shall not be liable for any failure to perform its obligations hereunder where such failure results from any cause beyond its reasonable control, including but not limited to, natural disasters, civil or military disruption, or technical failures.
                </p>
              </TermsSection>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  If you have any questions or concerns about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-indigo-50/70 rounded-lg p-4 space-y-2">
                  <p><strong>Email:</strong> contact@shariastocks.in</p>
                  {/* <p><strong>Phone:</strong> +91 98765 43210</p>
                  <p><strong>Address:</strong> ShariaStocks, 123 Financial District, Mumbai, Maharashtra 400001</p> */}
                </div>
              </div>
            </div>
          </section>
          <Footer />
        </main>
      </Suspense>
    </div>
  );
};

export default TermsAndConditions;