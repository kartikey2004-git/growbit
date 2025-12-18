/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  Users,
  BarChart3,
  Trophy,
  Activity,
  X,
  Menu,
} from "lucide-react";
import clsx from "clsx";
import UserButton from "@/modules/authentication/components/user-button";
import { Separator } from "../ui/separator";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Search", url: "/social/search", icon: Search },
  { title: "Social", url: "/social", icon: Users },
];

const insightsNav = [
  { title: "Stats", url: "/stats", icon: BarChart3 },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Feed", url: "/feed", icon: Activity },
];

export default function MobileNavOverlay({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const navigate = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg border border-black/10 bg-white/70 backdrop-blur"
      >
        <Menu className="h-5 w-5 text-black" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-white/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white/80 backdrop-blur-xl border-t border-black/10
              p-6"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 200 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120) setOpen(false);
              }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-black/20" />

              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-black">
                  Navigation
                </span>
                <button onClick={() => setOpen(false)}>
                  <X className="h-5 w-5 text-black/70" />
                </button>
              </div>

              <NavSection
                title="Main"
                items={mainNav}
                pathname={pathname}
                onNavigate={navigate}
              />

              <NavSection
                title="Insights"
                items={insightsNav}
                pathname={pathname}
                onNavigate={navigate}
              />

              <Separator className="mb-2" />

              <div className="flex items-center gap-3">
                {open && (
                  <span className="text-sm font-medium text-foreground">
                    Profile
                  </span>
                )}

                <div className="ml-auto">
                  {user && <UserButton user={user} />}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavSection({
  title,
  items,
  pathname,
  onNavigate,
}: {
  title: string;
  items: typeof mainNav;
  pathname: string;
  onNavigate: (url: string) => void;
}) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-xs font-semibold uppercase text-black/50">
        {title}
      </p>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.url;

          return (
            <button
              key={item.title}
              onClick={() => onNavigate(item.url)}
              className={clsx(
                "flex flex-col items-center gap-2 rounded-xl p-3",
                "border border-black/10 bg-white/60 backdrop-blur",
                "transition active:scale-95",
                active && "bg-white text-black border-black"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
