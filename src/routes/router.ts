/**
 * Application Router Strategy & Navigation Hooks
 * Standardized client-side route management and smooth scroll anchor dispatcher.
 */

import { useState, useEffect } from 'react';

export type AppRoute = 'home' | 'design-system';

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

      if (hash.includes('/design-system') || hash === '#design-system' || pathname === '/design-system') {
        setCurrentRoute('design-system');
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
    if (route === 'design-system') {
      window.location.hash = '#/design-system';
      setCurrentRoute('design-system');
    } else {
      if (targetAnchor) {
        window.location.hash = `#${targetAnchor}`;
        scrollToAnchor(targetAnchor);
      } else {
        window.location.hash = '';
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
