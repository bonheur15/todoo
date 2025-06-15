"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);

const CozyIllustration = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    className="relative w-64 h-64 md:w-80 md:h-80 mx-auto"
  >
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

export default function CozyHomepage() {
  return (
    <div className="bg-[#FDF8F0] text-[#4A4238] overflow-x-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,700&display=swap");
        .font-lora {
          font-family: "Lora", serif;
        }
        .font-nunito-sans {
          font-family: "Nunito Sans", sans-serif;
        }
      `}</style>

      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="font-lora text-3xl font-medium">Todoo</h1>
          <Link href={"/auth"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-nunito-sans font-bold text-base bg-white py-2 px-5 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              Sign In
            </motion.button>
          </Link>
        </nav>
      </header>

      <main className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-lora text-5xl sm:text-6xl lg:text-7xl font-medium leading-tight"
            >
              Find Your Flow, <br />
              <span className="text-[#C19A6B]">Gently.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="font-nunito-sans text-lg sm:text-xl text-[#6D6356] max-w-xl mx-auto lg:mx-0 mt-6"
            >
              Todoo is a calm, cozy corner on the internet to organize your
              tasks without the pressure. A simple, beautiful, and private space
              for your thoughts.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-10 flex justify-center lg:justify-start"
            >
              <Link href="/auth">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 font-nunito-sans font-bold text-lg bg-[#C19A6B] text-white py-4 px-8 rounded-full shadow-lg shadow-amber-900/20 hover:shadow-xl hover:bg-[#b58e60] transition-all"
                >
                  Get Started for Free
                  <ArrowRightIcon />
                </motion.button>
              </Link>
            </motion.div>
          </div>
          <div className="flex items-center justify-center">
            <CozyIllustration />
          </div>
        </div>
      </main>

      <section className="py-20 sm:py-28 bg-[#F6EFE6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-lora text-4xl sm:text-5xl font-medium">
              A Different Kind of To-Do List
            </h3>
            <p className="font-nunito-sans text-lg text-[#6D6356] max-w-2xl mx-auto mt-4">
              We focus on the features that matter, leaving out the ones that
              don&aps;t.
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-white/50 rounded-2xl">
              <div className="inline-block p-4 bg-emerald-100 text-emerald-700 rounded-xl">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h4 className="font-lora text-2xl font-medium mt-6">
                Organize into Lists
              </h4>
              <p className="font-nunito-sans text-base text-[#6D6356] mt-2">
                Group your tasks into separate lists for work, home, or your
                next big idea. Keep your mind tidy.
              </p>
            </div>
            <div className="text-center p-8 bg-white/50 rounded-2xl">
              <div className="inline-block p-4 bg-sky-100 text-sky-700 rounded-xl">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h4 className="font-lora text-2xl font-medium mt-6">
                Focus on Today
              </h4>
              <p className="font-nunito-sans text-base text-[#6D6356] mt-2">
                A clean, simple view that helps you focus on what&apos;s
                important right now, without overwhelming you.
              </p>
            </div>
            <div className="text-center p-8 bg-white/50 rounded-2xl">
              <div className="inline-block p-4 bg-rose-100 text-rose-700 rounded-xl">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </div>
              <h4 className="font-lora text-2xl font-medium mt-6">
                Made with Care
              </h4>
              <p className="font-nunito-sans text-base text-[#6D6356] mt-2">
                Every detail, from the fonts to the animations, is designed to
                make you feel calm and in control.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="font-lora text-4xl sm:text-5xl font-medium">
            Ready to find your calm?
          </h3>
          <p className="font-nunito-sans text-lg sm:text-xl text-[#6D6356] max-w-2xl mx-auto mt-6">
            Start organizing your life in a space that respects your focus and
            your peace of mind. It’s free to get started.
          </p>
          <div className="mt-10">
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 font-nunito-sans font-bold text-lg bg-[#C19A6B] text-white py-4 px-8 rounded-full shadow-lg shadow-amber-900/20 hover:shadow-xl hover:bg-[#b58e60] transition-all mx-auto"
              >
                Start Organizing Now
                <ArrowRightIcon />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-[#F6EFE6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-nunito-sans text-sm text-[#867a6e]">
            &copy; {new Date().getFullYear()} Todoo. A quiet place for your
            thoughts.
          </p>
        </div>
      </footer>
    </div>
  );
}
