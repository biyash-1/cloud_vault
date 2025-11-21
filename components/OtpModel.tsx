"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { RxCross2 } from "react-icons/rx";
import { Button } from "./ui/button";
import { sendEmailOTP, verifySecret } from "@/app/actions/user.action";
import { useRouter } from "next/navigation";

const OtpModel = ({ accountId, email }: { accountId: string; email: string }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await verifySecret({ accountId, password: otp });
      router.push("/dashboard");
    } catch (error) {
      console.error("OTP verification failed:", error);
      alert("Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendEmailOTP({ email });
      alert("A new OTP has been sent to your email.");
    } catch {
      alert("Failed to resend OTP. Please try again later.");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-white rounded-2xl shadow-lg p-8">
        <AlertDialogHeader className="flex flex-col items-center justify-center relative">
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Enter your OTP
          </AlertDialogTitle>
          <RxCross2
            className="absolute top-5 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
            size={20}
            onClick={() => setIsOpen(false)}
          />
          <AlertDialogDescription className="text-gray-600 text-center mt-2">
            A 6-digit verification code has been sent to{" "}
            <span className="font-medium">{email}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center mt-6">
          <InputOTP 
            autoFocus
            maxLength={6} 
            value={otp} 
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 text-lg border border-gray-300 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm hover:border-amber-400"
                />
              ))}
            </InputOTPGroup>

            <InputOTPSeparator className="mx-3 text-gray-400 font-bold">-</InputOTPSeparator>

            <InputOTPGroup className="flex gap-2">
              {[3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 text-lg border border-gray-300 rounded-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-sm hover:border-amber-400"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <AlertDialogFooter className="mt-6">
          <div className="flex flex-col items-center space-y-3 w-full">
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={isLoading || otp.length < 6}
              className="px-6 py-2 w-full bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-60 transition-all"
            >
              {isLoading ? "Verifying..." : "Submit"}
            </AlertDialogAction>

            <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
              <span>Didn't get a code?</span>
              <Button
                variant="link"
                className="text-amber-600 hover:text-amber-700 p-0 h-auto"
                onClick={handleResend}
              >
                Resend code
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModel;