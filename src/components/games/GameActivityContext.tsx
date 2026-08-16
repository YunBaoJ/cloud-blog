"use client";

import { createContext, useContext, type ReactNode } from "react";

const GameActivityContext = createContext(true);

export function GameActivityProvider({ active, children }: { active: boolean; children: ReactNode }) {
  return <GameActivityContext value={active}>{children}</GameActivityContext>;
}

export function useGameActivity(): boolean {
  return useContext(GameActivityContext);
}
