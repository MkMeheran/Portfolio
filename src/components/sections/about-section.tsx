"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { placeholderProfile } from "@/lib/placeholders";
import { createClient } from "@/lib/supabase/client";
import {
  Music,
  Heart,
  Camera,
  Gamepad2,
  BookOpen,
  Plane,
  Coffee,
  Code,
  Zap,
  Briefcase,
  Award,
} from "lucide-react";

const galleryImages = [
  { id: 1, src: "/placeholder-avatar.jpg", alt: "PROFILE", category: "PERSONAL" },
  { id: 2, src: "https://meheran-portfolio.vercel.app/assets/urp.webp", alt: "URP WORK", category: "ACADEMIC" },
  { id: 3, src: "https://meheran-portfolio.vercel.app/assets/StudentInformationWebsite.jpg", alt: "PROJECT", category: "WORK" },
  { id: 4, src: "https://meheran-portfolio.vercel.app/assets/URP_Cover_Image.jpg", alt: "DESIGN", category: "CREATIVE" },
];

const interests = [
  { label: "Music", Icon: Music },
  { label: "Passion", Icon: Heart },
  { label: "Photography", Icon: Camera },
  { label: "Gaming", Icon: Gamepad2 },
  { label: "Learning", Icon: BookOpen },
  { label: "Travel", Icon: Plane },
  { label: "Coffee", Icon: Coffee },
  { label: "Coding", Icon: Code },
];

const stats = [
  { value: "2+", label: "Years Experience", Icon: Zap },
  { value: "5", label: "Projects Built", Icon: Briefcase },
  { value: "3", label: "Fields Mastered", Icon: Award },
];

// NES-style box shadow (retro 8-bit effect)
const nesBoxStyle = {
  border: '4px solid #000',
  boxShadow: 'inset -4px -4px 0px #808080, inset 4px 4px 0px #dfdfdf',
  background: '#c0c0c0',
  padding: '2px'
};

const nesInnerStyle = {
  background: '#fff',
  border: '2px solid',
  borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
  padding: '2rem'
};

const nesButtonStyle = {
  border: '2px outset #dfdfdf',
  borderColor: '#dfdfdf #404040 #404040 #dfdfdf',
  background: '#c0c0c0',
  padding: '4px 12px',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.875rem',
  transition: 'border-color 0.1s'
};

export function AboutSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hoveredInterest, setHoveredInterest] = useState<number | null>(null);
  const [profile, setProfile] = useState<{ avatar_url?: string | null } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.from('profile').select('avatar_url').single();
        if (mounted && data) setProfile(data as any);
      } catch {}
    })();
    return () => { mounted = false };
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" style={{ padding: '3rem 1rem', background: 'linear-gradient(135deg, #fef3c7 0%, #fecaca 25%, #dbeafe 50%, #d1d5db 75%, #f3e8ff 100%)', fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", cursor: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', cursor: 'auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-1px',
            marginBottom: '1rem',
            cursor: 'auto',
            fontFamily: "'Courier New', monospace",
            color: '#1e40af'
          }}>
            $ About Me
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#333',
            fontWeight: 500,
            lineHeight: 1.6,
            cursor: 'auto'
          }}>
            Discover what drives my passion for innovation and creation
          </p>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Bio Card */}
          <div style={{ gridColumn: 'span 2', ...nesBoxStyle }}>
            <div style={nesInnerStyle}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', cursor: 'auto', fontFamily: "'Courier New', monospace" }}>$ Hello, I'm Meheran!</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div>
                  <p style={{
                    fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                    color: '#333',
                    lineHeight: 1.8,
                    marginBottom: '1.5rem',
                    fontWeight: 500,
                    cursor: 'auto'
                  }}>
                    I'm an <strong>Urban & Regional Planning</strong> student at KUET, passionate about bridging urban planning with cutting-edge technology. 
                    I combine spatial thinking with AI, GIS, and Web Development to create innovative solutions for real-world challenges.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button style={{ ...nesButtonStyle, color: '#000' }}>Planner</button>
                    <button style={{ ...nesButtonStyle, color: '#000' }}>Developer</button>
                    <button style={{ ...nesButtonStyle, color: '#000' }}>GIS Expert</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div style={{ ...nesBoxStyle }}>
            <div style={nesInnerStyle}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', cursor: 'auto', fontFamily: "'Courier New', monospace" }}>$ Journey</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.map((stat, idx) => {
                  const StatIcon = stat.Icon;
                  return (
                    <div key={idx} style={{ ...nesBoxStyle, padding: '0.5px' }}>
                      <div style={{ ...nesInnerStyle, padding: '1rem', background: idx === 0 ? '#fef08a' : idx === 1 ? '#bfdbfe' : '#e9d5ff', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <StatIcon size={28} style={{ minWidth: '28px', color: '#333' }} />
                        <div style={{ cursor: 'auto' }}>
                          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#333', fontFamily: "'Courier New', monospace" }}>
                            {stat.value}
                          </div>
                          <div style={{ fontSize: '0.95rem', color: '#666', fontWeight: 600, fontFamily: "'Courier New', monospace" }}>
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div style={{ ...nesBoxStyle, marginBottom: '2.5rem' }}>
          <div style={nesInnerStyle}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', cursor: 'auto', fontFamily: "'Courier New', monospace" }}>$ Interests</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
              {interests.map((interest, idx) => {
                const InterestIcon = interest.Icon;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredInterest(idx)}
                    onMouseLeave={() => setHoveredInterest(null)}
                    style={{
                      ...nesBoxStyle,
                      padding: '0.5px',
                      cursor: 'pointer',
                      transform: hoveredInterest === idx ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <div style={{ ...nesInnerStyle, textAlign: 'center', padding: '1.5rem', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <InterestIcon size={32} style={{ color: '#333' }} />
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333', cursor: 'auto', fontFamily: "'Courier New', monospace" }}>
                        {interest.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div style={{ ...nesBoxStyle, marginBottom: '2.5rem' }}>
          <div style={nesInnerStyle}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', cursor: 'auto', fontFamily: "'Courier New', monospace" }}>$ Gallery</h3>
            
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <div style={{ overflow: 'hidden', border: '2px solid #333' }}>
                <div style={{ display: 'flex', transition: 'transform 0.5s ease-out', transform: `translateX(-${currentImageIndex * 100}%)` }}>
                  {galleryImages.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        flex: '0 0 100%',
                        aspectRatio: '16 / 9',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onClick={() => setLightboxOpen(true)}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '1.5rem'
                      }}>
                        <div style={{ color: '#fff', cursor: 'auto' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ccc' }}>{img.category}</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{img.alt}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <button
                onClick={prevImage}
                onMouseEnter={() => setHoveredInterest(-1)}
                onMouseLeave={() => setHoveredInterest(null)}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  ...nesButtonStyle,
                  opacity: hoveredInterest === -1 ? 1 : 0.6,
                  transition: 'opacity 0.2s'
                }}
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                onMouseEnter={() => setHoveredInterest(-2)}
                onMouseLeave={() => setHoveredInterest(null)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  ...nesButtonStyle,
                  opacity: hoveredInterest === -2 ? 1 : 0.6,
                  transition: 'opacity 0.2s'
                }}
              >
                ›
              </button>

              {/* Indicators */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem', cursor: 'auto' }}>
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{
                      width: idx === currentImageIndex ? '1.5rem' : '0.75rem',
                      height: '0.75rem',
                      background: idx === currentImageIndex ? '#333' : '#ccc',
                      border: '2px solid #333',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ ...nesBoxStyle }}>
          <div style={nesInnerStyle}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', color: '#333', textAlign: 'center', cursor: 'auto' }}>
              Want to collaborate or learn more?
            </p>
            <div style={{ textAlign: 'center' }}>
              <a href="#contact" style={{ ...nesButtonStyle, padding: '8px 24px', fontSize: '1rem', display: 'inline-block', color: '#000', textDecoration: 'none' }}>
                Get In Touch →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem',
            cursor: 'auto'
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '80vh', width: '100%', cursor: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              width={800}
              height={450}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            style={{
              position: 'absolute',
              left: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              ...nesButtonStyle,
              color: '#000'
            }}
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            style={{
              position: 'absolute',
              right: '2rem',
              top: '50%',
              transform: 'translateY(-50%)',
              ...nesButtonStyle,
              color: '#000'
            }}
          >
            ›
          </button>
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              ...nesButtonStyle,
              color: '#000',
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
