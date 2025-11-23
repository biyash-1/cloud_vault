"use client";

import React, { useState } from "react";
import { createAccount } from "@/app/actions/user.action";
import OtpModel from "@/components/OtpModel";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const fullName = (form.elements.namedItem("name") as HTMLInputElement).value;
  const emailValue = (form.elements.namedItem("email") as HTMLInputElement).value;
  const password = (form.elements.namedItem("password") as HTMLInputElement).value;

  try {
    const accountId = await createAccount({ fullName, email: emailValue });

    if (!accountId) throw new Error("Failed to create account.");

    setAccountId(accountId); // ✅ for OTP modal
    setEmail(emailValue);

    toast.success("Signup successful! Please check your email for OTP verification.");
  } catch (error: any) {
    // Display backend error in toast
    toast.error(error.message || "Something went wrong. Please try again.");
  }
};


  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-2xl w-full max-w-md p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h1>
      <p className="text-sm text-gray-500 mb-6">
        Join CloudVault today and keep your files safe in the cloud.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all"
        >
          Sign Up
        </button>
      </form>

      {accountId && <OtpModel email={email} accountId={accountId} />}

      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <a href="/sign-in" className="text-blue-600 font-medium hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
