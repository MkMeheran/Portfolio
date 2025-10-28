"use client";
import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaInfoCircle,
  FaBook,
  FaBuilding,
  FaGlobe,
} from "react-icons/fa";

import data from "@/data/content.json";
import theme from "@/data/theme.json";

type Props = {
  footer: typeof data.footer;
  identity: typeof data.identity;
  theme: typeof theme;
};

export default function Footer({ footer, identity, theme }: Props) {
  const yr = new Date().getFullYear();

  return (
    <footer
      className="pt-12 bg-[#0a192f] text-gray-300 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto px-6 grid gap-10 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
        {/* Info */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold uppercase text-sm mb-4 text-emerald-400">
            <FaInfoCircle /> Info
          </h4>
          <ul className="space-y-2 text-sm">
            {footer.info.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.link}
                  className="hover:text-sky-400 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold uppercase text-sm mb-4 text-sky-400">
            <FaBook /> Resources
          </h4>
          <ul className="space-y-2 text-sm">
            {footer.resources.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold uppercase text-sm mb-4 text-amber-400">
            <FaBuilding /> Company
          </h4>
          <ul className="space-y-2 text-sm">
            {footer.company.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  className="hover:text-sky-400 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold uppercase text-sm mb-4 text-pink-400">
            <FaGlobe /> Follow Us
          </h4>
          <div className="flex flex-wrap gap-3 text-lg">
            {footer.socials.facebook && (
              <a
                href={footer.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-sky-400 hover:text-sky-400 transition"
              >
                <FaFacebook />
              </a>
            )}
            {footer.socials.twitter && (
              <a
                href={footer.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-sky-400 hover:text-sky-400 transition"
              >
                <FaTwitter />
              </a>
            )}
            {footer.socials.instagram && (
              <a
                href={footer.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-pink-400 hover:text-pink-400 transition"
              >
                <FaInstagram />
              </a>
            )}
            {footer.socials.github && (
              <a
                href={footer.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400 hover:text-emerald-400 transition"
              >
                <FaGithub />
              </a>
            )}
            {footer.socials.linkedin && (
              <a
                href={footer.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 border border-white/10 hover:border-sky-400 hover:text-sky-400 transition"
              >
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-white/10 mt-10 py-4 text-center text-xs text-gray-400">
        © {yr} <span className="text-emerald-400">{identity.name}</span>. All rights reserved.
      </div>
    </footer>
  );
}