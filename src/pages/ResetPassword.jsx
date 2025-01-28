import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../assets/styles/AuthTabs.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleOtpChange = (char, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = char;
    setOtp(updatedOtp);
    if (updatedOtp.every(slot => slot !== '')) {
      setIsOtpComplete(true);
    } else {
      setIsOtpComplete(false);
    }
  }

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('https://api.jewelsamarth.in/api/auth/send-reset-otp', { email }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setIsOtpSent(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('https://api.jewelsamarth.in/api/auth/verify-reset-otp', { email, otp: otp.join('') }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setIsOtpValid(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('https://api.jewelsamarth.in/api/auth/reset-password', { email, otp: otp.join(''), newPassword }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/auth?defaultTab=login');
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Reset Password | Jewel Samarth</title>
      </Helmet>
      <div className="w-[90%] max-w-[400px] mx-auto my-16">
        <Card className="card mt-4">
          <form onSubmit={!isOtpSent ? handleSendOtp : isOtpValid ? handleSubmitNewPassword : handleVerifyOtp}>
            <CardHeader>
              <CardTitle className="formHeadText text-2xl">Reset Password</CardTitle>
              <CardDescription>
                {!isOtpSent
                  ? "Enter your email address to reset your password."
                  : !isOtpValid
                    ? "Enter the OTP sent to your email address."
                    : "Enter your new password."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} placeholder="Your email address" onChange={handleEmailChange} required disabled={isOtpSent} />
              </div>
              {isOtpSent && !isOtpValid && (
                <div className="space-y-1">
                  <Label htmlFor="otp">OTP</Label>
                  <InputOTP value={otp} onChange={handleOtpChange} maxLength={6} className="input-otp">
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <InputOTPSlot key={idx} index={idx} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}
              {isOtpValid && (
                <div className="space-y-1">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={newPassword} placeholder="Enter your new password" onChange={handlePasswordChange} required />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="submitBtn" disabled={isLoading || (isOtpSent && !isOtpComplete && !isOtpValid)}>
                {isLoading ? 'Processing...' : (!isOtpSent ? 'Send OTP' : (!isOtpValid ? 'Verify OTP' : 'Set New Password'))}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        limit={3}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default ResetPassword;
