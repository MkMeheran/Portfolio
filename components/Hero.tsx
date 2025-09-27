"use client";
import { useEffect, useRef, useState } from "react";
import useTypewriter from "../hooks/useTypewriter";
import data from "@/data/content.json";
import theme from "@/data/theme.json";

type Props = {
  identity: typeof data.identity;
  theme: typeof theme;
};

export default function Hero({ identity, theme }: Props) {
  const iRef = useRef(0);
  const [idx, setIdx] = useState(0);
  const [ready, setReady] = useState(false);

  // role rotator
  useEffect(() => {
    if (!identity?.roles?.length) return;
    const t = setInterval(() => {
      iRef.current = (iRef.current + 1) % identity.roles!.length;
      setIdx(iRef.current);
    }, 2500);
    return () => clearInterval(t);
  }, [identity?.roles?.length]);

  // small delay before showing role
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  const role = identity?.roles?.[idx];
  const typedRole = useTypewriter(role?.name || "", 80);

  return (
    <section id="home" className="py-16">
      <div className="max-w-6xl mx-auto px-6 clearfix">
        {/* Badge */}
        <span className="inline-flex text-xs px-3 py-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-[#0f2a20]">
          Open to collaborations
        </span>
        <br />
        <span className="text-xl font-semibold text-[#dafdff89]">Hello there,</span>

        {/* Portrait */}
        <img
          src={identity?.portrait ? `/${identity.portrait}` : "/assets/Meheran.jpg"}
          alt={identity?.name ?? "Portrait"}
          className="hidden sm:block mt-[3.5%] aspect-square float-right align-top w-[40%] max-w-[400px] rounded-full border-4 border-[var(--accent)] shadow-lg mr-5 object-cover"
        />

        {/* Name */}
        <h1 className="text-[2.09rem] md:text-4xl sc875:text-5xl font-bold leading-tight ">
          I&apos;m&nbsp;
          <span style={{ color: theme.colors.primary }}>
            {identity?.name ?? "MOKAMMEL MORSHED"}
          </span>
        </h1>

        <h2 className="mt-2 opacity-95">
          Department of{" "}
          <span className="text-[var(--accent)] font-medium">
            Urban & Regional Planning
          </span>
          &nbsp;&nbsp;2417012
          <br />
          <span className="text-[#96f199ef] font-medium">
            Khulna University of Engineering & Technology (KUET)
          </span>
        </h2>

        {/* Role with typewriter */}
        {role?.name && ready && (
          <>
            <p className="mt-3 text-lg">
              <span>{role.prefix ?? "I’m"} </span>
              <span className="font-semibold text-[var(--accent)]">
                {typedRole}
              </span>
              <span className="animate-pulse">|</span>
            </p>
            {role.desc && <p className="text-muted">{role.desc}</p>}
          </>
        )}

        {/* Tagline */}
        {identity?.tagline && (
          <p className="mt-3 max-w-prose md:max-w-full">{identity.tagline}</p>
        )}

        {/* Location */}
        {identity?.location && <p className="mt-2 text-muted">{identity.location}</p>}
      </div>
    </section>
  );
}
