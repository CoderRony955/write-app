import React, { useState, useEffect } from 'react';
import { Sun, Moon, Mail, Github, Linkedin, Menu, X, StickyNote, Paintbrush, Instagram, InstagramIcon } from 'lucide-react';
import { useThemeStore } from '../store/theme';
import { cn } from '../lib/utils';
import logo from '../imgs/write_logo.png';

interface NavbarProps {
  onPageChange: (page: 'notes' | 'paint') => void;
  currentPage: 'notes' | 'paint';
}

export function Navbar({ onPageChange, currentPage }: NavbarProps) {
  const { isDark, toggleTheme } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shortcuts = [
    {
      icon: Mail,
      href: 'https://mail.google.com',
      color: 'text-red-600 hover:text-red-700',
    },
    {
      icon: Github,
      href: 'https://github.com',
      color: 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com',
      color: 'text-blue-600 hover:text-blue-700',
    },
    {
      icon: InstagramIcon,
      href: 'https://www.instagram.com/',
      color: 'text-pink-600 hover:text-purple-300',
    },
    {
      icon: X,
      href: 'https://x.com',
      color: 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
    },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl backdrop-saturate-200 rounded-b-xl max-h-20 ',
      isDark
        ? 'bg-gray-900/70 border-gray-700'
        : 'bg-black/10 border-gray-200'
    )}>
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">


            <img
              src={logo}
              alt="Quick Notes Logo"
              className="h-20 max-h-14 w-auto object-contain"
            />
          </div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onPageChange('notes')}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-full hover:scale-105 transition-transform duration-150 ',
                currentPage === 'notes'
                  ? 'bg-blue-900 text-white'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <StickyNote className="h-5 w-5" />
              <span>Notes</span>
            </button>
            <button
              onClick={() => onPageChange('paint')}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-full hover:scale-105 transition-transform duration-150',
                currentPage === 'paint'
                  ? 'bg-blue-900 text-white'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Paintbrush className="h-5 w-5" />
              <span>Paint</span>
            </button>

            {shortcuts.map((shortcut) => (
              <a
                key={shortcut.label}
                href={shortcut.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-500 dark:hover:bg-gray-800 active:scale-105 transition-transform duration-200 "
              >
                <shortcut.icon className={cn('h-5 w-5', shortcut.color)} />
                <span className="text-sm">{shortcut.label}</span>
              </a>
            ))}

            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-full transition-colors',
                isDark
                  ? 'text-yellow-500 hover:text-yellow-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-gray-700 dark:hover:bg-gray-800 "
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <X className={cn(
                'h-6 w-6',
                isDark ? 'text-white' : 'text-gray-900'
              )} />
            ) : (
              <Menu className={cn(
                'h-6 w-6',
                isDark ? 'text-white' : 'text-gray-900'
              )} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'fixed inset-x-0 top-[57px] p-4 backdrop-blur-4xl backdrop-saturate-200 bg-white/50 border-b border-white/30 transition-all duration-300 ease-in-out transform rounded-b-3xl',
            isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200 ',
            isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-full opacity-0 invisible',
            'md:hidden'
          )}
        >

          <div className="flex flex-col gap-2 ">
            <button
              onClick={() => {
                onPageChange('notes');
                setIsMenuOpen(false);
              }}
              className={cn(
                'flex items-center gap-2 p-3 rounded-full transition-colors w-full ',
                currentPage === 'notes'
                  ? 'bg-blue-900 text-white'
                  : isDark
                    ? 'text-white hover:bg-gray-800'
                    : 'text-gray-900 hover:bg-gray-100'
              )}
            >
              <StickyNote className="h-5 w-5" />
              <span className="font-medium">Notes</span>
            </button>
            <button
              onClick={() => {
                onPageChange('paint');
                setIsMenuOpen(false);
              }}
              className={cn(
                'flex items-center gap-2 p-3 rounded-full transition-colors w-full',
                currentPage === 'paint'
                  ? 'bg-blue-900 text-white'
                  : isDark
                    ? 'text-white hover:bg-gray-800'
                    : 'text-gray-900 hover:bg-gray-100'
              )}
            >
              <Paintbrush className="h-5 w-5" />
              <span className="font-medium">Paint</span>
            </button>

            {shortcuts.map((shortcut) => (
              <a
                key={shortcut.label}
                href={shortcut.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-2 p-3 rounded-full active:scale-105 transition-transform duration-100',
                  isDark
                    ? 'hover:bg-gray-800 text-white'
                    : 'hover:bg-gray-100 text-gray-900'
                )}
              >
                <shortcut.icon className={cn('h-5 w-5', shortcut.color)} />
                <span className="text-sm font-medium">{shortcut.label}</span>
              </a>
            ))}

            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className={cn(
                'flex items-center gap-2 p-3 rounded-full transition-colors w-full text-left',
                isDark
                  ? 'text-yellow-500 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className={cn(
                'text-sm font-medium',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                Toggle Theme
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}