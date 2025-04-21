import React, { ReactNode } from "react";
import { PlatformProvider } from "./platform";

interface AppWrapperProps {
  children: ReactNode;
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
  return <PlatformProvider>{children}</PlatformProvider>;
};
