"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      label: "Home",
      href: "/"
    },
    {
      label: "About the project",
      href: "/about"
    },
    {
      label: "Contact us",
      href: "/contact"
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-white bg-background">
      <div className="flex justify-between items-center p-3 sm:p-4 w-full">
        {/* Left side of the navbar - Logo and Title */}
        <div className="flex items-center gap-1  min-w-0 flex-1">
          <div className="relative w-15 h-15 sm:w-16 sm:h-16 md:w-20 md:h-20 shrink-0">
            <video
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="GlobalPDF logo animation"
            >
              <source src="/logo/logo-video.mp4" type="video/mp4" />
            </video>
          </div>
          <h1 className="font-comic-neue text-[20px] font-semibold sm:text-xl md:text-2xl lg:text-[36px] truncate">
            Global PDF Services
          </h1>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span className="font-comic-neue text-base lg:text-[20px] border-2 border-white px-3 py-2 rounded-md hover:bg-white hover:text-black transition-all duration-300 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button - Visible only on mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 p-2 border-2 border-white rounded-md hover:bg-white hover:text-black transition-all duration-300"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-current transition-all duration-300 ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu - Slides down when open */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 p-4 border-t-2 border-white bg-background">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block"
            >
              <span className="font-comic-neue text-lg border-2 border-white px-4 py-3 rounded-md hover:bg-white hover:text-black transition-all duration-300 block text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}