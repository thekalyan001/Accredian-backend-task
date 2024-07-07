// server.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const sendReferralEmail = require('./emailService');

// Middleware parse json, and cors origin.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// referme api route
app.post('/api/referme', async (req, res) => {
  try {
    const { referrerName, referrerEmail, refereeName, refereeEmail, referralMsg } = req.body;

    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
        return res.status(400).json({ error: 'Please enter all required fields' });
    }

    // Check if the refereeEmail already exists
    const existingReferral = await prisma.accredian.findUnique({
      where: { refereeEmail },
    });

    if (existingReferral) {
      return res.status(603).json({ error: 'Referee email already exists' });
    }

    
    const referral = await prisma.accredian.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        referralMsg,
      },
    });
      console.log("referral data is: ", referral);
      
    // Send email notification
    try {
        await sendReferralEmail(referrerName, referrerEmail, refereeName, refereeEmail, referralMsg);
        res.status(201).json(referral); // Return success response if email is sent successfully
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({ error: 'Referral created but error sending email.' });
      }
      
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error while creating referral.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
