"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ConnectButton from "./ConnectButton";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-green-400 to-gray-200 bg-clip-text text-transparent hover:from-green-300 hover:to-gray-100 transition-all duration-300">
                SecretHacks
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink href="/hackathons">Explore Hackathons</NavLink>
              <NavLink href="/projects">Explore Projects</NavLink>
              <ConnectButton />
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-colors duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/hackathons">Explore Hackathons</MobileNavLink>
            <MobileNavLink href="/projects">Explore Projects</MobileNavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-2">
              <ConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-green-400 transition-colors duration-300"
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-green-400 transition-colors duration-300"
  >
    {children}
  </Link>
);
