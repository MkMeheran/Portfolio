"use client";
import { useState } from "react";
import Link from "next/link";

type NavbarProps = {
  theme?: any; // 👉 শুধু declare করলাম, ব্যবহার করছেন না
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
    <header className="sticky top-0 z-50">
      <div className="max-w-[1130px] mx-auto flex items-center justify-between px-4 h-10 bg-[#507d80] border-b-2 border-black rounded-sm shadow-custom">
        <Link href="/" className="font-bold text-2xl">
          Portfolio
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[var(--accent)]">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-xl font-bold"
        >
          ☰
        </button>
      </div>

      {/* Overlay Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed top-0 right-0 h-full w-64 bg-[var(--surface)] shadow-custom p-6 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="text-right text-2xl mb-6"
            >
              ✕
            </button>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-lg hover:text-[var(--accent)]"
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
