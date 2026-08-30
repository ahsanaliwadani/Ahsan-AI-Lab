import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Demos', path: '/demos' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#081120]/95 backdrop-blur-md border-b border-blue-900/40 py-3 shadow-xl shadow-black/40' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo with Custom Circuit A Icon */}
          <BrandLogo 
            size="md" 
            onClick={() => handleNavClick('/')} 
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-900/40 border border-slate-800/60 p-1.5 rounded-full backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA & Admin trigger */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('/admin')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNavClick('/get-started')}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-200 shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('/get-started')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              ORDER
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#081120]/98 border-b border-blue-900/40 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <Sparkles className="w-4 h-4 text-cyan-200" />}
                </button>
              );
            })}

            <div className="pt-3 mt-2 border-t border-slate-800/80 space-y-2">
              <button
                onClick={() => handleNavClick('/get-started')}
                className="w-full flex items-center justify-center py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/30"
              >
                <span>GET STARTED / ORDER</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={() => handleNavClick('/admin')}
                className="w-full flex items-center justify-center py-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-xs font-medium"
              >
                <Shield className="w-4 h-4 mr-2 text-blue-400" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
