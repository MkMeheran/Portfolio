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
      className="pt-6"
      style={{ backgroundColor: "#0a192f", color: theme.colors.text }}
    >
      <div className="max-w-6xl mx-auto px-6 grid gap-8 grid-cols-2 md:grid-cols-4 text-left md:text-left">
        {/* Info */}
        <div>
          <h4 className="flex items-left gap-2 font-semibold uppercase text-sm mb-3">
            <FaInfoCircle /> Info
          </h4>
          <ul className="pl-10 md:pl-4 space-y-2 border-l-2  ml-3 text-sm">
            {footer.info.map((item, i) => (
              <li key={i}>
                <Link
                  href={item.link}
                  className="hover:text-[#0ef] transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="flex items-left gap-2 font-semibold uppercase text-sm mb-3">
            <FaBook /> Resources
          </h4>
          <ul className="pl-10 md:pl-4 space-y-2 border-l-2  ml-3 text-sm">
            {footer.resources.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  className="hover:text-[#0ef] transition"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="flex items-left gap-2 font-semibold uppercase text-sm mb-3">
            <FaBuilding /> Company
          </h4>
          <ul className="pl-10 md:pl-4 space-y-2 border-l-2 ml-3 text-sm">
            {footer.company.map((item, i) => (
              <li key={i}>
                <a
                  href={item.link}
                  className="hover:text-[#0ef] transition"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="flex items-center gap-2 font-semibold uppercase text-sm mb-3">
            <FaGlobe /> Follow Us
          </h4>
          <div className="flex justify-center md:justify-start space-x-4 text-xl">
            {footer.socials.facebook && (
              <a
                href={footer.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0ef]"
              >
                <FaFacebook />
              </a>
            )}
            {footer.socials.twitter && (
              <a
                href={footer.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0ef]"
              >
                <FaTwitter />
              </a>
            )}
            {footer.socials.instagram && (
              <a
                href={footer.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0ef]"
              >
                <FaInstagram />
              </a>
            )}
            {footer.socials.github && (
              <a
                href={footer.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0ef]"
              >
                <FaGithub />
              </a>
            )}
            {footer.socials.linkedin && (
              <a
                href={footer.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0ef]"
              >
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-10 py-4 text-center text-xs">
        © {yr} {identity.name}. All rights reserved.
      </div>
    </footer>
  );
}
