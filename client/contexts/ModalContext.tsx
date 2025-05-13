import { settingsButton } from "@telegram-apps/sdk";
import { createContext, useContext } from "react";

type ModalContextType = { openPreferences: () => void };
export const ModalContext = createContext<ModalContextType>({
  openPreferences: () => {},
});
export const useModal = () => useContext(ModalContext);
