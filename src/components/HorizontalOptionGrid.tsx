import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { OptionCard } from './OptionCard';
import type { CustomizationOption } from '../types';

interface HorizontalOptionGridProps {
  options: CustomizationOption[];
  selectedOption?: CustomizationOption | null;
  selectedOptions?: CustomizationOption[];
  onSelect: (option: CustomizationOption) => void;
  sectionIndex: number;
  multiSelect?: boolean;
}

export function HorizontalOptionGrid({ 
  options, 
  selectedOption, 
  selectedOptions, 
  onSelect, 
  sectionIndex,
  multiSelect = false
}: HorizontalOptionGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [options]);

  // Use regular grid for small number of options, horizontal scroll for many
  const useHorizontalScroll = options.length > 6;

  if (!useHorizontalScroll) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + sectionIndex * 0.1 + index * 0.05 }}
          >
            <OptionCard
              option={option}
              isSelected={multiSelect 
                ? selectedOptions?.some(item => item.id === option.id) || false
                : selectedOption?.id === option.id
              }
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto px-8 py-2 no-scrollbar"
      >
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + sectionIndex * 0.1 + index * 0.05 }}
            className="flex-shrink-0 w-32 sm:w-36"
          >
            <OptionCard
              option={option}
              isSelected={multiSelect 
                ? selectedOptions?.some(item => item.id === option.id) || false
                : selectedOption?.id === option.id
              }
              onSelect={onSelect}
            />
          </motion.div>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

    </div>
  );
}