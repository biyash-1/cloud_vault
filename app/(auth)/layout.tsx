import React from "react";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-screen flex m-0 p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Left Section - Modern Design */}
      <section className="hidden lg:flex w-2/5 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                             linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="text-center z-10 max-w-md relative">
          {/* Logo/Brand */}
          <div className=" flex justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md"></div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold mb-2 leading-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Welcome to
            <br />
            <span className="text-white font-extrabold drop-shadow-lg">CloudVault</span>
          </h1>
          
          <p className="text-lg mb-4 opacity-90 leading-relaxed font-light">
            Securely store, manage, and access your files from anywhere. 
            Enterprise-grade security meets effortless organization.
          </p>

          {/* Feature Points */}
          <div className="grid grid-cols-2 gap-4 mb-2 text-sm">
            <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Anywhere Access</span>
            </div>
          </div>

          {/* Main Illustration */}
          <div className="relative">
            <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 rounded-2xl  backdrop-blur-sm border border-white/20">
              <Image
                src="/filestorage.png"
                alt="Cloud Storage Illustration"
                width={280}
                height={200}
                className="object-contain mx-auto transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                  opacity=".25" 
                  className="fill-current text-white/30"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                  opacity=".5" 
                  className="fill-current text-white/40"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                  className="fill-current text-white/50"></path>
          </svg>
        </div>
      </section>

      {/* Right Section - Enhanced Design */}
      <section className="flex-1 flex items-center justify-center p-8 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #6366f1 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Cards in Background */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-indigo-200/30 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-purple-200/40 rounded-xl -rotate-12 animate-float delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-blue-200/50 rounded-lg rotate-45 animate-float delay-500"></div>

        {/* Main Content Container */}
        <div className=" w-full max-w-md z-10">
         {children}
        </div>
      </section>

      {/* Mobile Background Pattern */}
      <div className="lg:hidden absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #6366f1 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
}