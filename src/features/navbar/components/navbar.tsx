import type React from "react";
import NavbarContent from "./navbar-content";

interface NavbarProps {
  children: React.ReactNode;
}
const Navbar = ({ children }: NavbarProps) => {
  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border sticky top-0 z-50 border-b backdrop-blur">
      <div className="container mx-auto flex h-14 w-full items-center px-4">
        {children}
      </div>
    </nav>
  );
};

export default Navbar;
