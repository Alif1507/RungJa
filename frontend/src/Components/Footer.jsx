import React from "react";

/**
 * RungJa-style Footer built with Tailwind CSS
 * - Responsive, accessible, and easy to customize
 * - Pass your logo via `logoSrc` (optional)
 */
export default function FooterRungJa({
  brand = "RungJa",
  year = new Date().getFullYear(),
}) {
  const cols = [
    {
      title: "Partnership",
      links: [
        { label: "Social Media", href: "#" },
        { label: "Branding", href: "#" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Our Why", href: "#" },
        { label: "Our Work", href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Support Request", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#2F3E4B] text-white/90 mt-60">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
               <img
                  src="./img/logo.png"
                  alt={`${brand} logo`}
                  className="h-12 w-12 shrink-0 rounded-md object-contain"
                />
              <span className="text-2xl font-semibold tracking-wide">{brand}</span>
            </div>
          </div>

          {/* Columns */}
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title} className="space-y-3">
              <h3 className="text-[15px] font-semibold text-amber-400">{c.title}</h3>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Socials */}
          <div className="space-y-3">
            <h3 className="text-[15px] font-semibold text-amber-400">Follow Us</h3>
            <div className="flex items-center gap-3">
              <CircleIcon label="tiktok" />
              <CircleIcon label="fb" />
              <CircleIcon label="ig" />
              <CircleIcon label="in" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-sm text-white/70">
          <p>All Rights Reserved {year}</p>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}

// ===== Small helper components =====
function CircleIcon({ label }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-xs uppercase tracking-wide transition hover:border-white/70 hover:text-white"
    >
      {label}
    </a>
  );
}
