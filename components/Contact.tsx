"use client";

import data from "@/data/content.json";
import theme from "@/data/theme.json";
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";

type Props = {
  contact: typeof data.contact;
  theme: typeof theme;
};

export default function Contact({ contact, theme }: Props) {
  const Btn = (p: { label: string; href?: string; icon: React.ReactNode; color?: string }) =>
    p.href ? (
      <a
        className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium 
                    bg-white/5 border border-white/10 backdrop-blur-sm
                    hover:border-emerald-400/40 hover:shadow-emerald-400/20 
                    transition-colors`}
        style={{ color: p.color || theme.colors.text }}
        href={p.href}
        target="_blank"
        rel="noreferrer"
      >
        {p.icon}
        {p.label}
      </a>
    ) : null;

  return (
    <section id="contact" className="py-14 bg-[#000319] text-[var(--text)]">
      <div className="max-w-4xl mx-auto px-3 text-center">
        {/* Title */}
        <h2
          className="text-3xl md:text-4xl font-extrabold font-cyber 
                     bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 
                     bg-clip-text text-transparent tracking-wide inline-flex items-center gap-3"
        >
          Let’s Connect
        </h2>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Feel free to reach out for collaborations, projects, or just a friendly hello.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {contact.email && (
            <a
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium 
                         bg-gradient-to-r from-emerald-400 to-sky-400 text-black shadow-md"
              href={`mailto:${contact.email}`}
            >
              <FaEnvelope /> Email
            </a>
          )}
          <Btn label="GitHub" href={contact.github} icon={<FaGithub />} />
          <Btn label="LinkedIn" href={contact.linkedin} icon={<FaLinkedin />} color="#0A66C2" />
          <Btn label="Facebook" href={contact.facebook} icon={<FaFacebook />} color="#1877F2" />
          <Btn label="Telegram" href={contact.telegram} icon={<FaTelegram />} color="#229ED9" />
          <Btn label="WhatsApp" href={contact.whatsapp} icon={<FaWhatsapp />} color="#25D366" />
        </div>
      </div>
    </section>
  );
}