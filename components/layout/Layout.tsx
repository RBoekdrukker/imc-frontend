// components/layout/Layout.tsx
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  lang?: string;
}

export default function Layout({ children }: LayoutProps) {
  // Currently just a transparent wrapper.
  // We're handling Menu + Footer in _app.js.
  <Menu lang={lang} />
  return <>{children}</>;
}
