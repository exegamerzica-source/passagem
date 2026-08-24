import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileTabBar } from "./MobileTabBar";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="conteudo" className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
}
