/**
 * Application Router Strategy & Navigation Hooks
 * Standardized client-side route management and smooth scroll anchor dispatcher.
 */

import { useState, useEffect } from 'react';

export type AppRoute = 'home' | 'about' | 'design-system' | 'admin-leads' | '404';

export interface RouteState {
  currentRoute: AppRoute;
  anchor: string | null;
  navigateTo: (route: AppRoute, anchor?: string) => void;
  scrollToAnchor: (anchorId: string) => void;
}

export function useRouter(): RouteState {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [anchor, setAnchor] = useState<string | null>(null);

  useEffect(() => {
    const parseUrl = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;

      if (hash.includes('/admin/leads') || hash === '#admin/leads' || pathname === '/admin/leads' || pathname.startsWith('/admin')) {
        setCurrentRoute('admin-leads');
      } else if (hash.includes('/design-system') || hash === '#design-system' || pathname === '/design-system') {
        setCurrentRoute('design-system');
      } else if (hash.includes('/about') || hash === '#about' || pathname === '/about') {
        setCurrentRoute('about');
        window.scrollTo(0, 0);
      } else if (hash.startsWith('#/') && hash !== '#/' && !hash.startsWith('#/design-system') && !hash.startsWith('#/about') && !hash.startsWith('#/admin')) {
        setCurrentRoute('404');
      } else if (pathname !== '/' && pathname !== '' && pathname !== '/index.html' && pathname !== '/design-system' && pathname !== '/about' && !pathname.startsWith('/admin')) {
        setCurrentRoute('404');
      } else {
        setCurrentRoute('home');
        if (hash && !hash.includes('/')) {
          setAnchor(hash.replace('#', ''));
        }
      }
    };

    parseUrl();
    window.addEventListener('hashchange', parseUrl);
    window.addEventListener('popstate', parseUrl);

    return () => {
      window.removeEventListener('hashchange', parseUrl);
      window.removeEventListener('popstate', parseUrl);
    };
  }, []);

  const scrollToAnchor = (anchorId: string) => {
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navigateTo = (route: AppRoute, targetAnchor?: string) => {
    if (route === 'admin-leads') {
      window.location.hash = '#/admin/leads';
      setCurrentRoute('admin-leads');
    } else if (route === 'design-system') {
      window.location.hash = '#/design-system';
      setCurrentRoute('design-system');
    } else if (route === 'about') {
      window.location.hash = '#/about';
      setCurrentRoute('about');
      window.scrollTo(0, 0);
    } else {
      if (targetAnchor) {
        window.location.hash = `#${targetAnchor}`;
        scrollToAnchor(targetAnchor);
      } else {
        window.location.hash = '';
        window.scrollTo(0, 0);
      }
      setCurrentRoute('home');
    }
  };

  return {
    currentRoute,
    anchor,
    navigateTo,
    scrollToAnchor
  };
}
