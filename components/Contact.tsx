"use client";

import data from "@/data/content.json";
import theme from "@/data/theme.json";

type Props = {
  contact: typeof data.contact;
  theme: typeof theme;
};



export default function Contact({ contact, theme }: Props) {
  const Btn = (p: { label: string; href?: string }) =>
    p.href ? (
      <a
        className="px-4 py-2 rounded-sm font-medium shadow-custom hover:brightness-110"
        style={{ backgroundColor: theme.colors.primary, color: theme.colors.black }}
        href={p.href}
        target="_blank"
        rel="noreferrer"
      >
        {p.label}
      </a>
    ) : null;

  return (
    <section id="contact" className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold">Contact</h2>
        <p className="text-muted">
          Feel free to reach out for collaborations or just a friendly hello.
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          {contact.email && (
            <a
              className="px-4 py-2 rounded-sm font-medium shadow-custom"
              style={{ backgroundColor: theme.colors.accent, color: theme.colors.black }}
              href={`mailto:${contact.email}`}
            >
              Email
            </a>
          )}
          <Btn label="GitHub" href={contact.github} />
          <Btn label="LinkedIn" href={contact.linkedin} />
          <Btn label="Facebook" href={contact.facebook} />
          <Btn label="Telegram" href={contact.telegram} />
          <Btn label="WhatsApp" href={contact.whatsapp} />
          
        </div>
      </div>
    </section>
  );
}
