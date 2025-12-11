// components/layout/Layout.tsx
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  lang?: string; // available if you ever want it, but optional
}

export default function Layout({ children }: LayoutProps) {
  // Currently just a transparent wrapper.
  // Menu + Footer are handled in _app.tsx.
  return <>{children}</>;
}
