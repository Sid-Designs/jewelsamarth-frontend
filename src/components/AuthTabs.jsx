import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import '../assets/styles/AuthTabs.css';

export function AuthTabs({ formData, setFormData, signUp, logIn, defaultActiveTab, isLoading, errorMessage }) {
    const [activeTab, setActiveTab] = useState(defaultActiveTab);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    useEffect(() => {
        setActiveTab(defaultActiveTab);
    }, [defaultActiveTab]);

    return (
        <Tabs defaultValue={defaultActiveTab} value={activeTab} onValueChange={setActiveTab} className="w-[90%] max-w-[400px]">
            <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="signup" className="tabs text-lg lg:text-base">Sign Up</TabsTrigger>
                <TabsTrigger value="login" className="tabs text-lg lg:text-base">Log In</TabsTrigger>
            </TabsList>
            <TabsContent value="signup">
                <form onSubmit={signUp}>
                    <Card className="card mt-4">
                        <CardHeader>
                            <CardTitle className="formHeadText text-2xl">Sign Up</CardTitle>
                            <CardDescription>
                                Create a new account by filling out the form below.
                                {errorMessage && activeTab === 'signup' && <p className="error-message text-red-500">{errorMessage}</p>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" value={formData.username} placeholder="Your username" onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" className= {`${(errorMessage == "User Already Exists") && 'border-red-500 text-red-500'}`} value={formData.email} type="email" placeholder="Your email address" onChange={handleChange} required />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" value={formData.password} type="password" placeholder="Your Password" onChange={handleChange} required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="submitBtn" disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
            <TabsContent value="login">
                <form onSubmit={logIn}>
                    <Card className="card mt-4">
                        <CardHeader>
                            <CardTitle className="formHeadText text-2xl">Log In</CardTitle>
                            <CardDescription>
                                Log in to your account by filling out the form below.
                                {errorMessage && activeTab === 'login' && <p className="error-message text-red-500">{errorMessage}</p>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email} placeholder="Your email address" onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" className= {`${(errorMessage == "Invalid Credentials") && 'border-red-500 text-red-500'}`} type="password" value={formData.password} placeholder="Your Password" onChange={handleChange} required />
                            </div>
                        </CardContent>
                        <CardContent>
                            <div className="space-y-2">
                                <Link to="/auth/reset-password" className="underline forgetBtn">Forgot Password?</Link>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="submitBtn" disabled={isLoading}>
                                {isLoading ? 'Logging In...' : 'Log In'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </TabsContent>
        </Tabs>
    );
}
