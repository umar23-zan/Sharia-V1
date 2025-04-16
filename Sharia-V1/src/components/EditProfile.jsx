import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, UserRound, Loader2 } from 'lucide-react';
import { getUserData, updateUserData, uploadProfilePicture } from '../api/auth';
import account from '../images/account-icon.svg';
import logo from '../images/ShariaStocks-logo/logo1.jpeg';
const Header = lazy(() => import('./Header'));

const EditProfile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePictureChanged, setProfilePictureChanged] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [success, setSuccess] = useState('');
  
  const email = localStorage.getItem('userEmail');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      if (email) {
        try {
          const userData = await getUserData(email);
          setUser(userData);
          setFormData({
            name: userData.name || '',
            contactNumber: userData.contactNumber || '',
          });
          setProfilePicture(userData.profilePicture || '');
          setProfilePreview(userData.profilePicture || account);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setErrors({ general: "Failed to load user data" });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUserData();
  }, [email]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!/^[A-Za-z\s]+$/.test(value)) return 'Name must only contain letters and spaces.';
        if (value.length > 15) return 'Name must not exceed 15 characters.';
        return '';
      case 'contactNumber':
        if (!/^\d{10}$/.test(value)) return 'Contact number must be exactly 10 digits.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    setFormChanged(true);
    const error = validateField(name, value);
    setErrors((prevState) => ({
      ...prevState,
      [name]: error
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const maxFileSize = 2 * 1024 * 1024; // 2 MB
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (file) {
      if (!validFileTypes.includes(file.type)) {
        setErrors((prevState) => ({
          ...prevState,
          profilePicture: 'Only JPEG and PNG files are allowed.'
        }));
        return;
      }

      if (file.size > maxFileSize) {
        setErrors((prevState) => ({
          ...prevState,
          profilePicture: 'File size must not exceed 2 MB.'
        }));
        return;
      }

      setErrors((prevState) => ({
        ...prevState,
        profilePicture: ''
      }));

      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
      setProfilePictureChanged(true);
      
      // Automatically upload profile picture when it's changed
      try {
        setIsLoading(true);
        const data = new FormData();
        data.append('profilePicture', file);
        data.append('email', email);
        const response = await uploadProfilePicture(data);
        
        if (response && response.profilePicture) {
          setProfilePreview(response.profilePicture);
          setSuccess('Profile picture updated successfully');
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        setErrors((prevState) => ({
          ...prevState,
          profilePicture: 'Failed to upload profile picture.'
        }));
      } finally {
        setIsLoading(false);
        setProfilePictureChanged(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);
        await updateUserData(email, formData);
        const updatedUserData = await getUserData(email);
        setUser(updatedUserData);
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
        setFormChanged(false);
      } catch (error) {
        console.error("Error updating user data:", error);
        setErrors({ general: "Failed to update profile" });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }>
        <Header />
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold">Edit Profile</h1>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center justify-between">
              {success}
              <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
                &times;
              </button>
            </div>
          )}

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            {isLoading && !isSubmitting ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-28 h-28 md:w-32 md:h-32 mb-4">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100">
                      <img
                        src={profilePreview || account}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-md"
                      onClick={handleCameraClick}
                      disabled={isLoading}
                    >
                      {isLoading && profilePictureChanged ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Click to change profile picture</p>
                  {errors.profilePicture && (
                    <p className="text-red-500 text-sm mt-1">{errors.profilePicture}</p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    <h2 className="text-lg font-semibold border-b border-gray-100 pb-2">Personal Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-gray-500"
                        placeholder="Your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Enter your 10-digit phone number"
                      />
                      {errors.contactNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                      )}
                    </div>
                  </div>

                  {formChanged && (
                    <div className='flex justify-end'>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className=" py-2.5 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving Changes...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                    </button>
                    </div>
                    
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default EditProfile;