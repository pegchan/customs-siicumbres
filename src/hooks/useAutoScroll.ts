import { useCallback } from 'react';

export function useAutoScroll() {
  const scrollToNextSection = useCallback((currentSectionIndex: number) => {
    // Wait a bit for the UI to update
    setTimeout(() => {
      const sections = document.querySelectorAll('[data-section]');
      const nextSectionIndex = currentSectionIndex + 1;
      
      if (sections[nextSectionIndex]) {
        const nextSection = sections[nextSectionIndex] as HTMLElement;
        const headerHeight = 140; // Header + stepper height
        const offset = nextSection.offsetTop - headerHeight;
        
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 300); // Small delay for animations
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return {
    scrollToNextSection,
    scrollToTop
  };
}