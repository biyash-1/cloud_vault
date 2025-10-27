import React from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <section className="hidden md:flex w-1/3.5 bg-amber-600 text-white flex-col justify-center items-center p-16 relative overflow-hidden">
        <div className="text-center z-10 max-w-md">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Welcome to <br />
            <span className="text-yellow-200">CloudVault</span>
          </h1>
          <p className="text-lg mb-8 opacity-90">
            Securely store, manage, and access your files from anywhere in the
            cloud. Your data, safe and organized.
          </p>

          <div className="flex justify-center">
            <Image
              src="/filestorage.png"
              alt="File Storage"
              width={250}
              height={250}
              className="object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-400 opacity-20 rounded-full -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 opacity-20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* Right Side */}
      <section className="flex flex-1 items-center justify-center bg-gradient-to-br from-white to-amber-50 p-10">
        {children}
      </section>
    </div>
  );
}
