import { Link } from 'react-router-dom';
import { Star, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Signature Experience',
      links: [
        { to: '/cosmic-life-map', label: 'Cosmic Life Map™' },
        { to: '/birth-chart', label: 'Interactive Birth Chart' },
        { to: '/cosmic-timeline', label: 'Cosmic Timeline' },
        { to: '/reports', label: 'Downloadable PDF Reports' },
      ],
    },
    {
      title: 'Guidance & Tools',
      links: [
        { to: '/horoscope', label: 'Daily Guidance' },
        { to: '/compatibility', label: 'Celestial Compatibility' },
        { to: '/ai-astrology', label: 'AI Astrological Oracle' },
        { to: '/calendar', label: 'Celestial Calendar' },
      ],
    },
    {
      title: 'Account',
      links: [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/favorites', label: 'Saved & Bookmarks' },
        { to: '/profile', label: 'Birth Profile' },
        { to: '/settings', label: 'Preferences' },
      ],
    },
  ];

  return (
    <footer className="bg-cosmic-950 border-t border-white/10 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <Star className="text-gold-500 shrink-0" size={20} fill="currentColor" />
              <span className="font-cinzel text-lg font-bold text-gradient-gold">Mavi-AstroVision</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-3">
              Understand your personal cosmic pattern through an interactive, personalized experience.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold">
              <Sparkles size={12} /> Signature Cosmic Life Map™
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white/60 font-semibold text-sm mb-4 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-white/40 hover:text-gold-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {currentYear} Mavi-AstroVision. All rights reserved.
            </p>
            <p className="text-white/30 text-xs">
              Data attribution:{' '}
              <a
                href="https://cosmyday.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/60 underline transition"
              >
                CosmyDay
              </a>
            </p>
            <p className="text-white/20 text-xs flex items-center gap-1">
              Made with <Heart size={12} className="text-gold-500/60" /> for the cosmic community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
