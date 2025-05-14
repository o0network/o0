import { settingsButton } from "@telegram-apps/sdk";
import { createContext, useContext } from "react";

type ModalContextType = {
  openPreferences: () => void;
  openWalletConnect: () => void;
  closePreferences: () => void;
  closeWalletConnect: () => void;
};

export const ModalContext = createContext<ModalContextType>({
  openPreferences: () => {},
  openWalletConnect: () => {},
  closePreferences: () => {},
  closeWalletConnect: () => {},
});

export const useModal = () => useContext(ModalContext);
