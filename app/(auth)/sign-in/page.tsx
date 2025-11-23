"use client";
import React, { useState } from "react";
import { signInUser } from "@/app/actions/user.action";
import OtpModel from "@/components/OtpModel";
import toast from "react-hot-toast";

const SignInPage = () => {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [emailState, setEmailState] = useState<string>("");
const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = e.currentTarget;
  const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;

  // Call server action
  const res = await signInUser({ email });

  if (!res.success) {
    // show error from backend
    toast.error(res.message);
    return;                          
  }

  // success
  setAccountId(res.accountId);
  setEmailState(email);
  toast.success(res.message);
};

  return (
    <div className="bg-white border-gray-200 shadow-lg rounded-2xl w-full max-w-md p-10 mx-auto mt-20">
      <h1 className="text-3xl font-bold text-center mb-6">
        Login to your account
      </h1>

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
  className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
>
          Login
        </button>
      </form>

      {/* Signup link */}
      <p className="text-center text-gray-600 mt-6">
        Don’t have an account?{" "}
       <a
    href="/sign-up"
    className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
  >
    Sign up
  </a>
      </p>

      {accountId && <OtpModel email={emailState} accountId={accountId} />}
    </div>
  );
};

export default SignInPage;
