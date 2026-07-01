import { createContext, useContext } from "react";

export const GlobalAssistantContext = createContext({
  openAssistant: () => {},
});

export function useGlobalAssistant() {
  return useContext(GlobalAssistantContext);
}
