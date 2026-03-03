import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GoArrowLeft } from "react-icons/go";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/styles/AuthTabs.css';

export function AuthTabs({ formData, setFormData, signUp, logIn, defaultActiveTab, isLoading, errorMessage, handleForgetBtn }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get("defaultTab") || defaultActiveTab;
    const [activeTab, setActiveTab] = useState('signup');
    const [fade, setFade] = useState('opacity-100');

    useEffect(() => {
        setActiveTab(tabFromUrl);
    }, [tabFromUrl]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (activeTab === 'signup') {
            document.title = 'Sign Up | Sparkle with Elegance';
        } else if (activeTab === 'login') {
            document.title = 'Login | Timeless Beauty Awaits';
        }
    }, [activeTab]);

    const handleTabChange = (value) => {
        setFade('opacity-0');
        setTimeout(() => {
            setActiveTab(value);
            setSearchParams({ defaultTab: value }); // update URL
            setFade('opacity-100');
        }, 200); // transition timing
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return (
        <>
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

                <div className='authTabCnt mx-4 mb-4'>
                    <Tabs
                        defaultValue={defaultActiveTab}
                        value={activeTab}
                        onValueChange={handleTabChange}
                        className="w-full max-w-[400px]"
                    >
                        {/* Sign Up Tab */}
                        <TabsContent value="signup">
                            <div className={`transition-opacity duration-300 ${fade}`}>
                                <form onSubmit={signUp}>
                                    <Card className="card mt-4">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="formHeadText text-2xl">
                                                Join Us and Sparkle with Timeless Elegance!
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 py-0">
                                            <div className="space-y-1 authInput">
                                                <Label htmlFor="username">Username</Label>
                                                <Input
                                                    id="username"
                                                    value={formData.username}
                                                    placeholder="Your username"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1 authInput">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    className={errorMessage === "User Already Exists" ? 'border-red-500 text-red-500' : ''}
                                                    value={formData.email}
                                                    placeholder="Your email address"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1 authInput">
                                                <Label htmlFor="password">Password</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={formData.password}
                                                    placeholder="Your Password"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </CardContent>
                                        <CardContent className="pl-2 py-2 mb-2">
                                            <TabsList>
                                                <TabsTrigger value="login">
                                                    <div className="underline forgetBtn font-bold text-[15px]">
                                                        Already Have An Account?
                                                    </div>
                                                </TabsTrigger>
                                            </TabsList>
                                        </CardContent>
                                        <CardFooter>
                                            <Button type="submit" className="submitBtn w-[50%]" disabled={isLoading}>
                                                {isLoading ? 'Creating Account...' : 'Create Account'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </div>
                        </TabsContent>

                        {/* Log In Tab */}
                        <TabsContent value="login">
                            <div className={`transition-opacity duration-300 ${fade}`}>
                                <form onSubmit={logIn}>
                                    <Card className="card">
                                        <CardHeader>
                                            <TabsList>
                                                <TabsTrigger value="signup" className='w-full flex justify-end gap-2 items-center px-6 mb-8 text-sm'>
                                                    <div className='cursor-pointer gap-2 flex items-center text-[var(--accent-color)] transform scale-[1.1] hover:scale-[1.05] transition duration-300 ease-in-out'>
                                                        <GoArrowLeft size={18} /> Go Back
                                                    </div>
                                                </TabsTrigger>
                                            </TabsList>
                                            <CardTitle className="formHeadText text-2xl leading-7">
                                                Embrace Elegance Again! <br /> Log In to Shine On.
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div className="space-y-2 authInput">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    placeholder="Your email address"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2 authInput">
                                                <Label htmlFor="password">Password</Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    className={errorMessage === "Invalid Credentials" ? 'border-red-500 text-red-500' : ''}
                                                    value={formData.password}
                                                    placeholder="Your Password"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </CardContent>
                                        <CardContent>
                                            <div onClick={handleForgetBtn} className="underline forgetBtn cursor-pointer">
                                                Forgot Password?
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button type="submit" className="submitBtn w-[50%]" disabled={isLoading}>
                                                {isLoading ? 'Logging In...' : 'Log In'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

        </>
    );
}
