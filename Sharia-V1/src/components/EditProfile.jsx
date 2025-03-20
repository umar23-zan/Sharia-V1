import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, UserRound } from 'lucide-react';
import { getUserData, updateUserData, uploadProfilePicture } from '../api/auth';
import account from '../images/account-icon.svg'
import logo from '../images/ShariaStocks-logo/logo1.jpeg'
import Header from './Header';

const EditProfile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const email = localStorage.getItem('userEmail');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    doorNumber: '',
    streetName: '',
    city: '',
    country: '',
    pincode: ''
});

useEffect(() => {
  const fetchUserData = async () => {
      if (email) {
          const userData = await getUserData(email);
          setUser(userData);
          setFormData({
              name: userData.name,
              contactNumber: userData.contactNumber || '',
              doorNumber: userData.doorNumber || '',
              streetName: userData.streetName || '',
              city: userData.city || '',
              country: userData.country || '',
              pincode: userData.pincode || ''
          });
          setProfilePicture(userData.profilePicture || '');
          setProfilePreview(userData.profilePicture ? `${userData.profilePicture}` : account);
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
              if (!/^\d{10}$/.test(value)) return 'Contact number must be exactly 10 digits and contain only integers.';
              return '';
          
          
      case 'doorNumber':
          return value.length < 1 ? 'Door number is required' : '';
      case 'streetName':
          return value.length < 5 ? 'Street name is too short' : '';
      case 'city':
          return !/^[A-Za-z\s]+$/.test(value) ? 'Invalid city name' : '';
      case 'country':
          return !/^[A-Za-z\s]+$/.test(value) ? 'Invalid country name' : '';
      case 'pincode':
          return !/^\d{5,6}$/.test(value) ? 'Invalid pincode' : '';
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

  const error = validateField(name, value);
  setErrors((prevState) => ({
      ...prevState,
      [name]: error
  }));
};
const handleFileChange = (e) => {
  const file = e.target.files[0];
  const maxFileSize = 2 * 1024 * 1024; // 2 MB
  const validFileTypes = ['image/jpeg', 'image/png'];

  if (file) {
      if (!validFileTypes.includes(file.type)) {
          setErrors((prevState) => ({
              ...prevState,
              profilePicture: 'Only JPEG and PNG files are allowed.',
          }));
          setProfilePicture(null);
          setProfilePreview(null);
          return;
      }

      if (file.size > maxFileSize) {
          setErrors((prevState) => ({
              ...prevState,
              profilePicture: 'File size must not exceed 2 MB.',
          }));
          setProfilePicture(null);
          setProfilePreview(null);
          return;
      }

      setErrors((prevState) => ({
          ...prevState,
          profilePicture: '', // Clear previous errors
      }));

      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
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
      await updateUserData(email, formData);
      if (profilePicture) {
          const data = new FormData();
          data.append('profilePicture', profilePicture);
          data.append('email', email);
          await uploadProfilePicture(data);
      }
      const updatedUserData = await getUserData(email);
      setUser(updatedUserData);
      setProfilePreview(updatedUserData.profilePicture ? `${updatedUserData.profilePicture}` : account);
      alert('Profile Updated Successfully')
  } else {
      setErrors(newErrors);
  }
};
const handleCameraClick = () => {
  fileInputRef.current.click();
};

  return (
    <div className=" min-h-screen ">                 
        <Header />
      <div>
        <div className="max-w-7xl mx-auto p-4 flex items-center gap-4">
          <ArrowLeft 
            className="w-6 h-6 text-gray-600 cursor-pointer" 
            onClick={() => navigate(-1)} 
          />
          <h1 className="text-xl font-semibold">Edit Profile</h1>
        </div>

        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 mb-4 ">
                <img 
                  src={profilePreview? profilePreview : account}
                  alt="profile" 
                  className="w-full h-full rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700" onClick={handleCameraClick}>
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png"
                  className="hidden"
                />
              </div>
              <p className="text-sm text-gray-500">Click to change profile picture</p>
              {errors.profilePicture && <p className="text-red-500 text-sm">{errors.profilePicture}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-semibold">Address Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Door Number</label>
                    <input
                      type="text"
                      name="doorNumber"
                      value={formData.doorNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                     {errors.doorNumber && <p className="text-red-500 text-sm">{errors.doorNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Name</label>
                    <input
                      type="text"
                      name="streetName"
                      value={formData.streetName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                     {errors.streetName && <p className="text-red-500 text-sm">{errors.streetName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                     {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                     {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors mt-6"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;