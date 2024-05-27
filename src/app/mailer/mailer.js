'use server';
import { NextResponse, NextRequest } from 'next/server'
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'thefabcodeuser9@gmail.com',
    pass: process.env.APP_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: 'thefabcodeuser9@gmail.com',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return JSON.stringify(error);
  }
};

export default sendEmail;