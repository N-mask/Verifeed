import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface OTPDialogProps {
  open: boolean;
  otp: string;
  onVerify: () => void;
}

const OTPDialog = ({ open, otp, onVerify }: OTPDialogProps) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    if (value === otp) {
      onVerify();
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  // Show OTP in console for demo
  console.log(`🔑 Mock OTP: ${otp}`);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <ShieldCheck className="text-accent" size={24} />
            Verify Your Identity
          </DialogTitle>
          <DialogDescription>
            Enter the 6-digit OTP sent to your email. <br />
            <span className="text-accent font-semibold">(Demo: OTP is {otp})</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <InputOTP maxLength={6} value={value} onChange={setValue}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button onClick={handleVerify} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Verify OTP
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPDialog;
