import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OtpModel = ({ accountId, email }: any) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      console.log("Verifying OTP:", otp);
      // your OTP verification logic here
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>Open</AlertDialogTrigger>

      <AlertDialogContent className="bg-white rounded-2xl shadow-lg p-8">
        <AlertDialogHeader className="flex flex-col items-center justify-center">
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            Enter your OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-center mt-2">
            A 6-digit verification code has been sent to <span className="font-medium">{email}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* OTP Input */}
        <div className="flex justify-center mt-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 text-lg border border-gray-300 rounded-lg flex items-center justify-center 
                             focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all
                             shadow-sm hover:border-amber-400"
                />
              ))}
            </InputOTPGroup>

            <InputOTPSeparator className="mx-3 text-gray-400 font-bold">-</InputOTPSeparator>

            <InputOTPGroup className="flex gap-2">
              {[3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 text-lg border border-gray-300 rounded-lg flex items-center justify-center 
                             focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all
                             shadow-sm hover:border-amber-400"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {/* Footer Buttons */}
<AlertDialogFooter className="flex !justify-center items-center mt-3 space-x-4">
 
  <AlertDialogAction
    onClick={handleSubmit}
    disabled={isLoading || otp.length < 6}
    className="px-6 py-2 w-full bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-60 transition-all"
  >
    {isLoading ? "Verifying..." : "Submit"}
  </AlertDialogAction>
</AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModel;
