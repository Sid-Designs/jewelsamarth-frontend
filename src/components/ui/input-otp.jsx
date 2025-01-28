import * as React from "react";
import { createContext, useContext } from "react";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";

// Create the context for OTP input
const OTPInputContext = createContext();

// InputOTP Component
const InputOTP = ({ value, onChange, maxLength = 6, children, ...props }) => {
  const slots = Array.from({ length: maxLength }).map((_, index) => ({
    value: value[index] || '',
    onChange: (char) => onChange(char, index),
    hasFakeCaret: false,
    isActive: false,
  }));

  return (
    <OTPInputContext.Provider value={{ slots }}>
      <div {...props}>
        {children}
      </div>
    </OTPInputContext.Provider>
  );
};

// InputOTPGroup Component
const InputOTPGroup = ({ children, ...props }) => (
  <div {...props} className="flex items-center">
    {children}
  </div>
);

// InputOTPSlot Component
const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const { slots } = useContext(OTPInputContext);
  const { value, onChange } = slots[index];

  const handleKeyUp = (e) => {
    if (e.target.value && e.key !== "Backspace") {
      const nextSibling = e.target.nextElementSibling;
      if (nextSibling && nextSibling.tagName === "INPUT") {
        nextSibling.focus();
      }
    } else if (e.key === "Backspace") {
      const prevSibling = e.target.previousElementSibling;
      if (prevSibling && prevSibling.tagName === "INPUT") {
        prevSibling.focus();
      }
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyUp={handleKeyUp}
      maxLength={1}
      className={cn(
        "w-10 h-10 text-center border border-primary",
        index === 0 ? "rounded-l-md" : "",
        index === 5 ? "rounded-r-md" : "",
        className
      )}
      {...props}
    />
  );
});

InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
