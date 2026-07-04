import { useEffect, useState } from "react";
export type AppView =
  | "booting"
  | "permission"
  | "blocked"
  | "invite"
  | "setup"
  | "home"
  | "edit";
const listeners = new Set<(state: AppView) => void>();
let currentState: AppView = "booting";

export const setHomeViewState = (state: AppView) => {
  currentState = state;
  listeners.forEach((listener) => listener(state));
};

export function useHomeViewState() {
  const [state, setState] = useState<AppView>(currentState);
  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);
  return state;
}
