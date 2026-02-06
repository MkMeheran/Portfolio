"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Music,
  Heart,
  Camera,
  Gamepad2,
  Plane,
  BookOpen,
  Coffee,
  Sparkles,
  User,
  Pause,
  Play,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Code,
  Globe,
} from "lucide-react";
import { placeholderProfile } from "@/lib/placeholders";
import { createClient } from "@/lib/supabase/client";

// Gallery images
const galleryImages = [
  { id: 1, src: "/placeholder-avatar.jpg", alt: "Profile" },
  { id: 2, src: "https://meheran-portfolio.vercel.app/assets/urp.webp", alt: "URP Work" },
  { id: 3, src: "https://meheran-portfolio.vercel.app/assets/StudentInformationWebsite.jpg", alt: "Project" },
  { id: 4, src: "https://meheran-portfolio.vercel.app/assets/URP_Cover_Image.jpg", alt: "Cover Design" },
];

// Interests data
const interests = [
  { icon: Code, label: "Coding", color: "bg-violet-500" },
  { icon: Globe, label: "GIS & Maps", color: "bg-emerald-500" },
  { icon: Camera, label: "Photography", color: "bg-pink-500" },
  { icon: Gamepad2, label: "Gaming", color: "bg-blue-500" },
  { icon: BookOpen, label: "Learning", color: "bg-amber-500" },
  { icon: Plane, label: "Travel", color: "bg-cyan-500" },
  { icon: Coffee, label: "Coffee", color: "bg-orange-500" },
  { icon: Music, label: "Music", color: "bg-rose-500" },
];

export function AboutSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [profile, setProfile] = useState<{ avatar_url?: string | null } | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/music/favorite-song.mp3");
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Handle autoplay restriction
          console.log("Audio playback requires user interaction");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-10 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-rose-50/80" />
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-violet-200/30 rounded-full blur-2xl animate-pulse delay-500" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Header with Music Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-violet-500 border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917]">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-space)]">About Me</h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium font-[family-name:var(--font-space)]">Get to know me better</p>
            </div>
          </div>
          
          {/* Music Player Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleMusic}
              className={`relative group border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all ${
                isPlaying ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white' : 'bg-white text-stone-900'
              }`}
              size="sm"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline text-xs font-bold">Playing</span>
                  {/* Animated music bars */}
                  <div className="flex items-end gap-0.5 ml-2 h-3">
                    <div className="w-0.5 bg-white animate-bounce" style={{ height: '8px', animationDelay: '0ms' }} />
                    <div className="w-0.5 bg-white animate-bounce" style={{ height: '12px', animationDelay: '150ms' }} />
                    <div className="w-0.5 bg-white animate-bounce" style={{ height: '6px', animationDelay: '300ms' }} />
                  </div>
                </>
              ) : (
                <>
                  <Music className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline text-xs font-bold">Play Music</span>
                </>
              )}
            </Button>
            {isPlaying && (
              <Button
                onClick={toggleMute}
                variant="outline"
                size="icon"
                className="h-8 w-8 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* About Me Card */}
          <Card className="lg:col-span-2 bg-white/80 backdrop-blur-sm border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0 hidden sm:block">
                  <div className="w-20 h-20 border-2 border-stone-900 shadow-[3px_3px_0px_0px_#1c1917] overflow-hidden">
                    <Image
                      src={profile?.avatar_url || placeholderProfile.avatar}
                      alt="Meheran"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-400 border-2 border-stone-900">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-black mb-2 font-[family-name:var(--font-space)]">
                    Hey, I&apos;m Meheran! 👋
                  </h3>
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-[family-name:var(--font-space)]">
                    I&apos;m an <span className="font-bold text-amber-600">Urban & Regional Planning</span> student at KUET, 
                    passionate about bridging urban planning with cutting-edge technology. I combine spatial thinking 
                    with AI, GIS, and Web Development to create innovative solutions for real-world planning challenges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interests Card */}
          <Card className="bg-gradient-to-br from-fuchsia-50 to-violet-50 border-2 border-stone-900 shadow-[4px_4px_0px_0px_#1c1917] overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-fuchsia-400 border-2 border-stone-900">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-black text-base tracking-tight font-[family-name:var(--font-space)]">My Interests</h3>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {interests.map((interest, idx) => {
                  const Icon = interest.icon;
                  return (
                    <div
                      key={idx}
                      className={`group flex flex-col items-center justify-center p-2 ${interest.color} border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer`}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] sm:text-[10px] font-bold text-white mt-1 font-[family-name:var(--font-space-mono)]">{interest.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Section */}
        <Card className="mt-4 bg-stone-900 border-2 border-stone-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-amber-400 border-2 border-stone-700">
                  <Camera className="h-4 w-4 text-stone-900" />
                </div>
                <h3 className="font-black text-base tracking-tight text-white font-[family-name:var(--font-space)]">Gallery</h3>
              </div>
              <div className="flex items-center gap-1">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 transition-all ${
                      idx === currentImageIndex ? 'bg-amber-400 w-4' : 'bg-stone-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Carousel */}
            <div className="relative group">
              <div className="overflow-hidden">
                <div 
                  className="flex gap-2 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentImageIndex * (100 / galleryImages.length)}%)` }}
                >
                  {galleryImages.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative shrink-0 w-[calc(50%-4px)] sm:w-[calc(33.333%-6px)] md:w-[calc(25%-6px)] aspect-[4/3] border-2 border-stone-700 overflow-hidden cursor-pointer transition-all duration-300 ${
                        idx === currentImageIndex ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-900' : 'opacity-70 hover:opacity-100'
                      }`}
                      onClick={() => {
                        setCurrentImageIndex(idx);
                        setLightboxOpen(true);
                      }}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white">{img.alt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-400 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-amber-400 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white border-2 border-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-w-4xl max-h-[80vh] w-full aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryImages[currentImageIndex].src}
              alt={galleryImages[currentImageIndex].alt}
              fill
              className="object-contain"
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 p-2 bg-amber-400 border-2 border-stone-900"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 p-2 bg-amber-400 border-2 border-stone-900"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </section>
  );
}
