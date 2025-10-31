"use client";

import React, { useState } from "react";
import { signInUser } from "@/app/actions/user.action";
import OtpModel from "@/components/OtpModel";

const SignInPage = () => {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [emailState, setEmailState] = useState<string>("");


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const userId = await signInUser({email}); // make sure signInUser returns accountId
      setAccountId(userId);                  // set state to show OTP modal
      setEmailState(email);

      alert("OTP has been sent to your email.");
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to login. Please try again.");
    }
  };

  return (
    <div className="bg-white border-gray-200 shadow-lg rounded-2xl w-full max-w-md p-10 mx-auto mt-20">
      <h1 className="text-3xl font-bold text-center mb-6">Login to your account</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg transition-all"
        >
          Login
        </button>
      </form>

      {/* Signup link */}
      <p className="text-center text-gray-600 mt-6">
        Don’t have an account?{" "}
        <a href="/sign-up" className="text-amber-600 font-medium hover:underline">
          Sign up
        </a>
      </p>

      {/* ✅ OTP modal */}
      {accountId && <OtpModel email={emailState} accountId={accountId} />}
    </div>
  );
};

export default SignInPage;
