"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowersList } from "@/modules/social/components/FollowersList";
import { FollowingList } from "@/modules/social/components/FollowingList";

export default function SocialPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        w-full
        px-4 sm:px-6 lg:px-8
        py-6 sm:py-8
        space-y-6
      "
    >
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Connections
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage followers and people you follow
        </p>
      </div>

      <Tabs defaultValue="followers" className="w-full">
        <TabsList className="h-9">
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="mt-4">
          <FollowersList />
        </TabsContent>

        <TabsContent value="following" className="mt-4">
          <FollowingList />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
