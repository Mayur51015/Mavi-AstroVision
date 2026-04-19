import React from 'react';
import { Heart, Mail as MailIcon } from 'lucide-react';

// Use simple emoji icons for social media as fallback
const GithubIcon = () => <span>🐙</span>;
const TwitterIcon = () => <span>𝕏</span>;
const LinkedinIcon = () => <span>💼</span>;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cosmic-950 border-t border-cosmic-700 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cosmic-400 to-gold-500 bg-clip-text text-transparent mb-2">
              ✨ Mavi-AstroVision
            </h3>
            <p className="text-cosmic-300 text-sm">
              Your guiding light through the cosmos
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-cosmic-300 text-sm">
              <li><a href="/" className="hover:text-gold-400 transition">Home</a></li>
              <li><a href="/horoscope" className="hover:text-gold-400 transition">Horoscopes</a></li>
              <li><a href="/chart" className="hover:text-gold-400 transition">Birth Chart</a></li>
              <li><a href="/profile" className="hover:text-gold-400 transition">Profile</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-cosmic-300 text-sm">
              <li><a href="#" className="hover:text-gold-400 transition">Astrology 101</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Zodiac Signs</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-gold-400 transition">FAQ</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-gold-400 font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-cosmic-300 hover:text-gold-400 transition">
                <TwitterIcon />
              </a>
              <a href="#" className="text-cosmic-300 hover:text-gold-400 transition">
                <GithubIcon />
              </a>
              <a href="#" className="text-cosmic-300 hover:text-gold-400 transition">
                <LinkedinIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cosmic-700 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-cosmic-400 text-sm">
            <p>© {currentYear} Mavi-AstroVision. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-gold-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-gold-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-gold-400 transition">Contact</a>
            </div>
          </div>
          
          <p className="text-center text-cosmic-500 text-xs mt-4 flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-gold-500" /> by the cosmic team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
