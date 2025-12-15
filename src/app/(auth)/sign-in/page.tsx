"use client";

import Link from "next/link";
import React from "react";
import { authClient } from "@/lib/auth-client";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Trees, CheckCircle2, Flame, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";

const SignIn = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-[#f6fff8] text-gray-900">
      <div className="bg-linear-to-br from-[#17B100] via-[#1FCC00] to-[#0E8F00] text-white text-sm py-2 text-center">
        Build habits. Stay consistent. Grow every day.
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="grid grid-cols-[minmax(0,640px)_1fr] items-center h-16">
          <div className="flex items-center gap-3 px-6 lg:pl-24">
            <div className="w-8 h-8 rounded-full bg-[#17B100] text-white flex items-center justify-center">
              <Trees size={16} />
            </div>

            <Link href="/" className="text-xl font-semibold">
              Growbit
            </Link>
          </div>

          <div className="flex justify-end items-center gap-3 px-6 lg:pr-12">
            <Button
              variant="outline"
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
            >
              Sign In
            </Button>

            <Button
              className="bg-[#17B100] text-white hover:bg-[#17B100]/80"
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,640px)_1fr] min-h-[calc(100vh-120px)]">
        <div className="px-6 lg:pl-24 lg:pr-12 py-12 max-w-xl">
          <h1 className="text-5xl font-semibold leading-tight mb-6">
            Build habits that actually stick.
          </h1>

          <p className="text-lg text-gray-700 mb-10">
            Track daily progress, build streaks, and stay accountable with
            friends. Growbit helps you stay consistent without overthinking.
          </p>

          <Button
            className="w-full bg-[#17B100] text-white hover:bg-[#17B100]/80 py-3"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
              })
            }
          >
            Start Tracking Habits
          </Button>

          <div className="flex items-center my-6 text-gray-400">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full py-5 gap-3"
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/",
                })
              }
            >
              <FaGoogle className="h-4 w-4" />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full py-5 gap-3"
              onClick={() =>
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/",
                })
              }
            >
              <FaGithub className="h-4 w-4" />
              Continue with GitHub
            </Button>
          </div>

          <p className="mt-8 text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <span className="text-[#17B100] hover:underline">Terms</span> &{" "}
            <span className="text-[#17B100]  hover:underline">
              Privacy Policy
            </span>
            .
          </p>
        </div>

        <div className="relative lg:ml-8 lg:mt-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
              <div>
                <p className="text-sm font-semibold">Today’s Habits</p>
                <p className="text-xs text-gray-500">Keep your streak alive</p>
              </div>

              <span className="flex items-center gap-1 text-xs bg-green-50 text-[#17B100]  px-2 py-1 rounded">
                <Flame size={14} />
                7-day streak
              </span>
            </div>

            <div className="grid grid-cols-[260px_1fr] min-h-105">
              <aside className="border-r bg-gray-50 p-4 text-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold">Your Habits</p>
                  <Plus size={16} className="text-[#17B100]" />
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-[#17B100] font-medium">
                    <CheckCircle2 size={16} />
                    Daily Coding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Read 20 mins
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Workout
                  </li>
                </ul>

                <div className="mt-6 flex items-center gap-2 text-xs text-gray-600">
                  <Users size={14} />3 friends tracking with you
                </div>
              </aside>

              <section className="flex flex-col p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {date?.toDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      2 / 3 habits completed
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-[#17B100] text-white hover:bg-[#17B100]/80"
                  >
                    Check In
                  </Button>
                </div>
              </section>
            </div>
          </div>

          <div className="absolute -z-10 inset-0 bg-linear-to-r from-green-300 to-emerald-200 blur-3xl opacity-40" />
        </div>
      </main>

      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-16">
            Everything you need to build habits that last
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 text-[#17B100] flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Daily Habit Tracking
              </h3>
              <p className="text-gray-600 text-sm">
                Check in every day and build streaks that keep you consistent.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 text-[#17B100] flex items-center justify-center">
                <Flame size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Streaks & Progress</h3>
              <p className="text-gray-600 text-sm">
                Visualize your progress and never lose momentum.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 text-[#17B100] flex items-center justify-center">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Friends & Accountability
              </h3>
              <p className="text-gray-600 text-sm">
                Follow friends, compare streaks, and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 bg-[#17B100]">
      
        <div
          className="
      px-6 sm:px-10 lg:px-20
      py-20 sm:py-24 lg:py-28
      max-w-2xl
      flex flex-col justify-center
    "
        >
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white">
              Growbit
            </h1>

            <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 items-center justify-center">
              <Trees className="h-full w-full text-white" />
            </div>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-md">
            Simple habit tracking that keeps you consistent.
          </p>
        </div>

        
        <div className="hidden lg:block relative w-full h-105">
          <Image
            src="/banner.png"
            alt="Growbit mobile preview"
            fill
            priority
            className="object-contain"
          />
        </div>
      </section>

      <footer className="bg-white border-t py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Growbit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SignIn;
