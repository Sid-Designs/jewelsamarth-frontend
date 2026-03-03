import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from 'react-toastify';
import axios from 'axios';
import '../assets/styles/AuthTabs.css';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('token'); 
    try {
      const res = await axios.post(
        'https://api.jewelsamarth.in/api/auth/send-verify-otp',
        { email },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setIsOtpSent(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while sending the OTP. Please try again.');
    } finally {
      setIsLoading(false); 
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'https://api.jewelsamarth.in/api/auth/verify-otp',
        { email, otp: otp.join('') },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate(`/`)
        },1500)
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error('An error occurred while verifying the OTP. Please try again.');
    }
  }

  return (
    <>
      <Helmet>
        <title>Email Verification | Jewel Samarth</title>
      </Helmet>
      <div className="flex justify-center items-center h-full mt-14 mb-2">
        <div className='authTabMainCnt'>
          <div className='p-4 hidden lg:flex'>
            <div className='authTabImg'>
              <img
                className='object-cover h-full w-full'
                src="https://plus.unsplash.com/premium_photo-1674255466849-b23fc5f5d3eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amV3ZWxlcnl8ZW58MHx8MHx8fDA%3D"
                alt="Auth Visual"
              />
            </div>
          </div>
          <div className='authMiddleLine my-12 mx-4 hidden lg:flex'></div>
      <div className="w-[90%] min-w-[350px] max-w-[400px] mx-auto my-16">
        <Card className="card mt-4">
          <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp}>
            <CardHeader>
              <CardTitle className="formHeadText text-2xl">Email Verification</CardTitle>
              <CardDescription>
                {isOtpSent
                  ? "Enter the OTP sent to your email address."
                  : "Enter your email address to receive an OTP."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 authInput">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} placeholder="Your email address" onChange={handleEmailChange} required disabled={isOtpSent} />
              </div>
              {isOtpSent && (
                <div className="space-y-1 authInput">
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
            </CardContent>
            <CardFooter>
              <Button type="submit" className="submitBtn" disabled={isOtpSent && !isOtpComplete}>
                {isLoading ? 'Sending...' : (isOtpSent ? 'Verify Email' : 'Send OTP')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      </div>
      </div>
    </>
  );
}

export default EmailVerification;
