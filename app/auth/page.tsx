"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" width="24" height="24" {...props}>
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.38,36.331,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

// A decorative SVG element for a cozy touch
const CozyIllustration = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
    className="relative w-48 h-48 md:w-64 md:h-64 mb-4"
  >
    {/* Plant Pot */}
    <svg
      viewBox="0 0 100 100"
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/3 z-10"
    >
      <path
        d="M 20 100 Q 50 80 80 100 L 75 90 Q 50 70 25 90 Z"
        fill="#C19A6B"
      />
      <rect x="18" y="98" width="64" height="2" fill="#A47D53" />
    </svg>

    {/* Leaves */}
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute top-0 left-0 w-full h-full"
      style={{ transformOrigin: "bottom center" }}
      animate={{ rotate: [0, -2, 0, 2, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M 50 90 C 20 70, 20 30, 50 10"
        stroke="#556B2F"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 50 90 C 80 70, 80 30, 50 10"
        stroke="#556B2F"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 50 80 C 30 60, 35 40, 55 25"
        stroke="#6B8E23"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 50 80 C 70 60, 65 40, 45 25"
        stroke="#6B8E23"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 50 70 C 40 50, 45 40, 50 35"
        stroke="#8FBC8F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </motion.svg>
  </motion.div>
);

export default function CozyLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("credentials", {
        anonymous: "true", // Matches the dummy credential field in auth.ts
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Anonymous sign in failed:", error);
      setIsLoading(false); // Only if signIn itself throws an error before redirect
    }
    // setIsLoading(false); // Typically, redirect will occur before this is hit
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FDF8F0] font-sans text-[#4A4238]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Nunito+Sans:opsz,wght@6..12,400;6..12,700&display=swap");
        .font-lora {
          font-family: "Lora", serif;
        }
        .font-nunito-sans {
          font-family: "Nunito Sans", sans-serif;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md mx-4 p-8 md:p-12 bg-[#F6EFE6] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-center"
      >
        <CozyIllustration />

        <h1 className="font-lora text-3xl md:text-4xl font-medium mb-3">
          A quiet space for your thoughts
        </h1>
        <p className="font-nunito-sans text-base text-[#6D6356] mb-8">
          Let&apos;s get you settled in. Your cozy corner of the internet
          awaits.
        </p>

        <motion.button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          <span className="font-nunito-sans font-bold text-base">
            {isLoading ? "Redirecting..." : "Continue with Google"}
          </span>
        </motion.button>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-[#EADFD1]"></div>
          <span className="mx-4 font-nunito-sans text-sm text-[#867A6E]">
            OR
          </span>
          <div className="flex-grow border-t border-[#EADFD1]"></div>
        </div>

        <motion.button
          onClick={handleAnonymousSignIn}
          disabled={isLoading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {/* Icon can be added here if available, e.g., a generic user/guest icon */}
          <span className="font-nunito-sans font-bold text-base">
            {isLoading ? "Redirecting..." : "Continue as Guest"}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
