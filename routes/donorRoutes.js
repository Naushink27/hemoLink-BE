import express from 'express';
import { verifyToken, isDonor } from './authMiddleware.js';
import User from '../models/userModel.js';
import Post from '../models/postsModel.js';
import DonationRequest from '../models/donationRequestModel.js';

import nodemailer from 'nodemailer';

const router = express.Router();

// Get donor profile

router.get('/profile', verifyToken, isDonor, async (req, res) => {
  try {

    const donor = await User.findById(req.user.id).select('-password');
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" })
    }
    res.status(200).json(donor);

  } catch (errr) {
    res.status(500).json({ message: error.message })
  }
})

router.patch('/update', verifyToken, isDonor, async (req, res) => {
  try {
    const { fullName, phone, state, city } = req.body;

    const updatedDonor = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phone, state, city },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedDonor) {
      return res.status(404).json({ message: "Donor not found" })
    }
    // await updatedDonor.save();
    res.status(200).json({ message: "Profile updated successfully", updatedDonor });
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// API for creating posts:

router.post('/posts', verifyToken, isDonor, async (req, res) => {
  try {

    const { content, imageUrl } = req.body;

    if (!content || !imageUrl) {
      return res.status(400).json({ message: "Please provide content or image" });
    }

    const newPost = new Post({
      Author: req.user.id,
      content,
      imageUrl,
    });

    await newPost.save();
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/allposts', verifyToken, isDonor, async (req, res) => {

  try {
    const posts = await Post.find().populate("Author", "fullName email")
    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.get('/allrequests', verifyToken, isDonor, async (req, res) => {
  try {
    const requests = await DonationRequest.find().populate("requester", "fullName email bloodGroup phone city state urgency unitRequired")
    if (!requests) {
      return res.status(404).json({ message: "No donation requests found" })
    }
    if (requests.length === 0) {
      return res.status(404).json({ message: "No donation requests found" })
    }
    res.status(200).json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})



router.post("/interested/:requestId", verifyToken, isDonor, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { donorName, email, phone, bloodGroup, address, description } = req.body;

   
    const donationRequest = await DonationRequest.findById(requestId);
    if (!donationRequest) {
      return res.status(404).json({ message: "Donation request not found" });
    }

    const patient = await User.findById(donationRequest.requester);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientEmail = patient.email;
    console.log("Patient Email:", patientEmail);
    console.log("Email:", process.env.EMAIL_USER);
    console.log("Pass:", process.env.EMAIL_PASS);
   

    const transporter = nodemailer.createTransport({
      host: 'gmail',
     
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    const mailOptions = {
      from: `"HemoLink 🩸" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: `New Donor Interested in Your Blood Request - ${donorName}`,
      html: `
        <h2>New Donor Interested!</h2>
        <p>Dear ${patient.fullName || "User"},</p>
        <p>A donor has expressed interest in your blood request. Details:</p>
        <ul>
          <li><strong>Name:</strong> ${donorName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Blood Group:</strong> ${bloodGroup}</li>
          <li><strong>Address:</strong> ${address}</li>
          <li><strong>Description:</strong> ${description}</li>
        </ul>
        <p>Please reach out to the donor directly to coordinate donation.</p>
      `,
    };

   
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Interest expressed successfully! Patient notified via email.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
});




export default router;
