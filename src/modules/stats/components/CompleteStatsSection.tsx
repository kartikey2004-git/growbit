/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompletionStats } from "../hooks/useCompletionStats";
import { CompletionChart } from "./CompletionChart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export function CompletionStatsSection() {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");
  const { data, isLoading } = useCompletionStats(range);

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium">Completion Trend</h2>

        <Tabs value={range} onValueChange={(v) => setRange(v as any)}>
          <TabsList className="h-8">
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground"
          >
            Loading completions…
          </motion.p>
        ) : (
          data && (
            <motion.div
              key={range}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CompletionChart series={data.data.series} />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </Card>
  );
}
