const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const { uploadToS3, deleteFromS3 } = require('../config/s3config');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require("jsonwebtoken");
const session = require('express-session');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
    
      const payload = {
        user: {
          id: req.user.id,
          email: req.user.email,
          profilePicture: req.user.photos?.[0]?.value || null,
        }
      };
  
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          
          res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}&email=${req.user.email}&id=${req.user.id}`);
        }
      );
    }
  );


router.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Passwords do not match' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        user = new User({ name, email, password: hashedPassword, verificationToken: verificationToken });
        await user.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

        const message = `
            <p>Thank you for registering with our service!</p>
            <p>Please verify your email address by clicking on the following link:</p>
            <p><a href="${verificationUrl}">Verify Email Address</a></p>
            <p>This link will expire in 24 hours.</p>
        `;

        await transporter.sendMail({ 
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email Address',
            html: message, 
        });

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).send('Server error');
    }
});


router.get("/verify/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findOne({ email: decoded.email });
      if (!user) return res.status(400).json({ msg: "Invalid or expired token" });
      if (user.isVerified) return res.status(400).json({ msg: "Email is already verified." });

      res.status(200).json({ msg: "Token is valid." });
    } catch (error) {
      res.status(500).json({ msg: "Invalid or expired token" });
    }
  });

  router.post("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });

        if (!user) return res.status(400).json({ msg: "Invalid or expired token" });
        if (user.isVerified) return res.status(400).json({ msg: "Email is already verified." });

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ msg: "Email verified successfully!" });
    } catch (error) {
        res.status(400).json({ msg: "Invalid or expired token" });
    }
});

router.post('/resend-verification', async (req, res) => {
const { email } = req.body;

if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
}

try {
    // Find the user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
    return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if already verified
    if (user.isVerified) {
    return res.status(400).json({ msg: 'Email is already verified' });
    }

    // Generate a new verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Create verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    // Email content
    const message = `
    <p>You requested a new verification link.</p>
    <p>Please verify your email address by clicking on the following link:</p>
    <p><a href="${verificationUrl}">Verify Email Address</a></p>
    <p>This link will expire in 24 hours.</p>
    `;

    // Send email
    await transporter.sendMail({ 
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email Address',
    html: message, 
    });

    res.status(200).json({ msg: 'Verification email resent successfully' });
} catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ msg: 'Server error' });
}
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Email not verified. Please check your inbox to verify your email address.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        res.status(200).json({ msg: 'Login successful', email: user.email, id: user._id });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Forgot Password Route
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      // Generate a reset token
      const resetToken = crypto.randomBytes(20).toString('hex');

      // Hash the token and set expiration (1 hour)
      const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpire = resetPasswordExpire;
      await user.save();

      // Send the reset link via email
      const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
      const message = `You are receiving this email because you (or someone else) requested a password reset. Click the link to reset your password: \n\n ${resetUrl}`;
      
      await transporter.sendMail({
          to: email,
          subject: 'Password Reset Request',
          text: message,
      });

      res.status(200).json({ msg: 'Password reset email sent' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;

  try {
      // Hash the incoming token and find the user with the matching reset token and check if it's not expired
      const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() }, // Make sure the token is not expired
      });

      if (!user) {
          return res.status(400).json({ msg: 'Invalid or expired token' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Reset the token and expiration fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error' });
  }
});


router.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        // Return user data without password
        const { password, ...userData } = user._doc; // Exclude password from response
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Update User Data Route
// Update User Route
// Example of the updateUserData function
router.put('/user/:email', async (req, res) => {
    const email = req.params.email;
    const { name, contactNumber, doorNumber, streetName, city, country, pincode } = req.body;

    try {
        // Update the user data
        const user = await User.findOneAndUpdate(
            { email },
            { name, contactNumber, doorNumber, streetName, city, country, pincode },
            { new: true } // Return the updated document
        );

        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({
            msg: 'User updated successfully',
            user: {
                name: user.name,
                email: user.email,
                contactNumber: user.contactNumber,
                doorNumber: user.doorNumber,
                streetName: user.streetName,
                city: user.city,
                country: user.country,
                pincode: user.pincode,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Invalid file type. Only JPG and PNG allowed.');
            error.code = 'INVALID_FILE_TYPE';
            return cb(error, false);
        }
        cb(null, true);
    }
});
router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const email = req.body.email;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const fileUrl = await uploadToS3(req.file, email);

        if (user.profilePicture) {
            try {
                await deleteFromS3(user.profilePicture);
            } catch (error) {
                console.error('Error deleting old profile picture:', error);
                // Continue with the update even if delete fails
            }
        }
        user.profilePicture = fileUrl;
        await user.save();

        res.json({ 
            msg: 'Profile picture uploaded successfully', 
            // profilePicture: relativeFilePath 
            profilePicture: user.profilePicture 
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'INVALID_FILE_TYPE') {
            return res.status(400).json({ msg: error.message });
        }
        res.status(500).send('Server error');
    }
});

router.get('/user-plan/:email', async (req, res) => {
        const { email } = req.params;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
    
            // Return only the user's plan
            res.status(200).json({ plan: user.subscription.plan });
    
        } catch (error) {
            console.error("Error fetching user plan:", error);
            res.status(500).send('Server error');
        }
    });


// Contact Us Route
router.post('/contact-us', async (req, res) => {
    const request = req.body;
    
    // Create the formdata object from the request
    const formdata = {
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        message: request.message
    };

    try {
        // Create a new contact entry and save it to the database
        const contactEntry = new ContactUs(formdata);
        const savedEntry = await contactEntry.save(); // Save to the database and get the saved entry
        
        // Send email using the saved entry
        await sendEmail(savedEntry); 
        
        // Return the saved entry as a response
        res.status(200).json({ message: 'Contact details saved successfully and email sent!', data: savedEntry });
    } catch (error) {
        console.error('Error saving contact details or sending email:', error);
        res.status(500).json({ message: 'Error saving contact details or sending email.' });
    }
});

router.delete('/deactivate/:email', async (req, res) => {
    const { email } = req.params;
    const { password, subscriptionId } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect password' });
        }

        
        if (user.profilePicture) {
            try {
                await deleteFromS3(user.profilePicture);
            } catch (error) {
                console.error('Error deleting profile picture:', error);
               
            }
        }

        if (subscriptionId) {
            try {
                await razorpay.subscriptions.cancel(subscriptionId);
            } catch (error) {
                console.error('Error cancelling Razorpay subscription:', error);
            }
        }    
        await User.findOneAndDelete({ email });

        res.status(200).json({ msg: 'Account deactivated successfully' });
    } catch (error) {
        console.error('Error deactivating account:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
