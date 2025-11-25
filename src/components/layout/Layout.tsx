import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  userRole?: "customer" | "internal";
}

export const Layout = ({ children, userRole }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="flex w-full">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
