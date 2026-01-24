import React from "react";
import {
  Film,
  Instagram,
  Twitter,
  Facebook,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative bg-[#020202] pt-20 pb-10 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-600 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-500 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.4)]">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter uppercase text-white">
              Movie<span className="text-pink-500">Town</span>
            </span>
          </div>
          <p className="text-zinc-500 text-sm leading-relaxed font-medium">
            Your premier destination for neon-infused cinematic experiences.
            Luxury seats, crystal clear sound, and the best popcorn in the city.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <button
                key={i}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-pink-500 hover:border-pink-500/50 transition-all"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">
            Get in Touch
          </h4>
          <ul className="space-y-4 text-sm font-bold text-zinc-500">
            <li className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-pink-500/5 border border-pink-500/10">
                <MapPin className="w-4 h-4 text-pink-500" />
              </div>
              <span className="mt-1">Neon Street 77, Night City</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-pink-500/5 border border-pink-500/10">
                <Phone className="w-4 h-4 text-pink-500" />
              </div>
              <span>+48 500 600 700</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-pink-500/5 border border-pink-500/10">
                <Mail className="w-4 h-4 text-pink-500" />
              </div>
              <span>hello@movietown.com</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white">
            Stay Tuned
          </h4>
          <p className="text-zinc-500 text-xs font-medium italic leading-relaxed">
            Join the elite club for secret screenings, private events, and
            late-night premieres.
          </p>
          <div className="relative group">
            <input
              type="email"
              placeholder="Your secure email..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 transition-all placeholder:text-zinc-700"
            />
            <button className="absolute right-2.5 top-2.5 bg-pink-500 text-white p-2 rounded-xl hover:bg-pink-400 transition-all shadow-lg shadow-pink-500/20 active:scale-95">
              <ChevronRight className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
          © {currentYear} MovieTown Digital Industries. Crafted with neon.
        </p>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
          <a href="#" className="hover:text-pink-500 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-pink-500 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-pink-500 transition-colors">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
};
