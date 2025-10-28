"use client";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

type Theme = {
  colors: {
    bg: string;
    surface: string;
    surface2: string;
    line: string;
    text: string;
    muted: string;
    primary: string;
    accent: string;
    accent2: string;
    alert: string;
    mainname: string;
    black: string;
  };
  radius: string;
  shadow: string;
  font: {
    [key: string]: string;
  };
};

type NavbarProps = {
  theme?: Theme;
};

export default function Navbar({ theme }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 font-sans">
      <div className="max-w-[1125px] mx-auto flex items-center  justify-between px-6 h-14 
                      bg-slate-900 border-b border-emerald-500/20 shadow-md">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-sky-500 
                     bg-clip-text text-transparent tracking-wide"
        >
          Portfolio
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-gray-300 hover:text-emerald-400 transition-colors 
                         after:content-[''] after:absolute after:w-0 after:h-[2px] 
                         after:left-0 after:-bottom-1 after:bg-emerald-400 
                         hover:after:w-full after:transition-all after:duration-300"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-2xl text-gray-200 hover:text-emerald-400 transition-colors"
        >
          <FaBars />
        </button>
      </div>

      {/* Overlay Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed top-0 right-0 h-full w-64 bg-slate-900 shadow-lg p-6 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="text-right text-2xl mb-6 text-gray-300 hover:text-emerald-400 transition-colors"
            >
              <FaTimes />
            </button>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-lg text-gray-300 hover:text-emerald-400 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}