"use client";

import { Agentation } from "agentation";

export default function AgentationDevtools() {
  if (process.env.NODE_ENV !== "development") return null;

  return <Agentation />;
}
