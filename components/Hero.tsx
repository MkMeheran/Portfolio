"use client";
import { useEffect, useRef, useState } from "react";
import useTypewriter from "../hooks/useTypewriter";
import data from "@/data/content.json";
import theme from "@/data/theme.json";
import { FaGraduationCap, FaUniversity, FaIdBadge } from "react-icons/fa";
 import { FaMapMarkerAlt } from "react-icons/fa";
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
    <section id="home" className="bg-[#000319] py-16">
      <div className="max-w-6xl mx-auto px-6 clearfix font-sans">
        {/* Badge */}
        <span className="inline-flex text-xs px-3 py-2 rounded-full 
                         bg-gradient-to-r from-emerald-400 to-sky-400 
                         text-slate-900 font-semibold shadow-sm">
          Open to collaborations
        </span>

        <br />
        <span className="text-xl font-semibold text-gray-300 mt-2 block">
          Hello there,
        </span>

        {/* Portrait */}
        <img
          src={identity?.portrait ? `/${identity.portrait}` : "/assets/Meheran.jpg"}
          alt={identity?.name ?? "Portrait"}
          className="hidden sm:block mt-[3.5%] aspect-square float-right align-top 
                     w-[40%] max-w-[400px] rounded-full border-4 
                     border-emerald-400 shadow-lg mr-5 object-cover"
        />

        {/* Name */}
        <h1 className="text-[2.3rem] md:text-4.5xl font-cyber font-bold leading-tight tracking-wide mt-4">
          I&apos;m&nbsp;
          <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 
                           bg-clip-text text-transparent drop-shadow-md">
            {identity?.name ?? "MOKAMMEL MORSHED"}
          </span>
        </h1>

      <h2 className="mt-4 leading-snug">
  {/* Department */}
  <div className="flex items-center gap-2 text-[16px] md:text-xl font-semibold text-emerald-400">
    <FaUniversity className="text-emerald-400 text-2xl min-w-[24px] min-h-[24px]" />
    Department of Urban & Regional Planning
  </div>

  {/* ID */}
  <div className="flex items-center gap-2 text-base md:text-lg text-gray-400 mt-1">
    <FaIdBadge className="text-sky-400 text-xl min-w-[22px] min-h-[22px]" />
    Student ID: 2417012
  </div>

  {/* University */}
  <div
    className="flex items-center gap-2 text-[16px] md:text-xl font-extrabold font-mono 
               bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 
               bg-clip-text text-transparent mt-2"
  >
    <FaGraduationCap className="text-emerald-400 text-3xl md:text-xl min-w-[28px] min-h-[28px]" />
    Khulna University of Engineering & Technology (KUET)
  </div>
</h2>

        {/* Role with typewriter */}
        {role?.name && ready && (
          <>
            <p className="mt-4 text-lg font-sans text-gray-300">
              <span>{role.prefix ?? "I’m"} </span>
              <span className="font-semibold text-emerald-400 drop-shadow-sm">
                {typedRole}
              </span>
              <span className="animate-pulse text-cyan-400">|</span>
            </p>
            {role.desc && (
              <p className="text-sm text-gray-400 mt-1">{role.desc}</p>
            )}
          </>
        )}

        {/* Tagline */}
        {identity?.tagline && (
          <p className="mt-4 max-w-prose md:max-w-full text-gray-300 font-light">
            {identity.tagline}
          </p>
        )}

      

{identity?.location && (
  <a
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(identity.location)}`}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-2 text-sm font-semibold mt-1 md:text-sm text-gray-400 hover:text-emerald-400 transition leading-snug"
  >
    <FaMapMarkerAlt className="text-emerald-400 min-w-[16px] min-h-[16px]" />
    {/* যদি location split করতে চাও */}
    <span className="text-emerald-300">Feni</span>,{" "}
    <span className="text-sky-300">Bangladesh</span>
  </a>
)}
      </div>
    </section>
  );
}