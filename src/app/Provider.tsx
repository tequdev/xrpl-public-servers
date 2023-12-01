'use client';
import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";

type Props = {
  children: React.ReactNode;
}

export const Provider: React.FC<Props> = ({ children }) => {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
