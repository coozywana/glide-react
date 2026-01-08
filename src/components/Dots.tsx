import React, { ReactElement, ReactNode, useMemo } from 'react';

// ============================================================================
// Types
// ============================================================================

export interface DotsProps {
  /** Total number of slides */
  slideCount: number;
  /** Number of slides to scroll per navigation */
  slidesToScroll: number;
  /** Number of slides to show */
  slidesToShow: number;
  /** Current slide index */
  currentSlide: number;
  /** Enable infinite looping */
  infinite: boolean;
  /** Click handler */
  onDotClick: (index: number) => void;
  /** Custom dot renderer */
  customPaging?: (index: number) => ReactElement;
  /** Custom dots container */
  appendDots?: (dots: ReactNode) => ReactElement;
  /** Dots container class */
  dotsClass: string;
  /** Pause on dots hover handler */
  onMouseEnter?: () => void;
  /** Resume on dots leave handler */
  onMouseLeave?: () => void;
}

// ============================================================================
// Default Styles
// ============================================================================

const defaultDotsContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  listStyle: 'none',
  margin: '16px 0 0',
  padding: 0,
  gap: 8,
};

const defaultDotButtonStyle: React.CSSProperties = {
  width: 10,
  height: 10,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const activeDotButtonStyle: React.CSSProperties = {
  ...defaultDotButtonStyle,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
};

// ============================================================================
// Dots Component
// ============================================================================

export const Dots: React.FC<DotsProps> = ({
  slideCount,
  slidesToScroll,
  slidesToShow,
  currentSlide,
  infinite,
  onDotClick,
  customPaging,
  appendDots,
  dotsClass,
  onMouseEnter,
  onMouseLeave,
}) => {
  // ============================================================================
  // Calculate Dot Count
  // ============================================================================

  const dotCount = useMemo(() => {
    if (infinite) {
      return Math.ceil(slideCount / slidesToScroll);
    }
    return Math.ceil((slideCount - slidesToShow) / slidesToScroll) + 1;
  }, [slideCount, slidesToScroll, slidesToShow, infinite]);

  // ============================================================================
  // Handle Dot Click
  // ============================================================================

  const handleDotClick = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    // Blur the button to prevent focus staying on it after click
    (e.target as HTMLButtonElement).blur?.();
    onDotClick(index * slidesToScroll);
  };

  // ============================================================================
  // Render Dots
  // ============================================================================

  const dots = useMemo(() => {
    return Array.from({ length: dotCount }).map((_, index) => {
      const isActive = index === Math.floor(currentSlide / slidesToScroll);
      
      const dotButton = customPaging ? (
        customPaging(index)
      ) : (
        <button
          type="button"
          style={isActive ? activeDotButtonStyle : defaultDotButtonStyle}
          aria-label={`Go to slide ${index + 1}`}
        />
      );

      return (
        <li
          key={index}
          className={isActive ? 'glide-active' : ''}
          style={{ display: 'inline-block' }}
        >
          <div
            onClick={handleDotClick(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDotClick(index * slidesToScroll);
              }
            }}
            role="button"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
          >
            {dotButton}
          </div>
        </li>
      );
    });
  }, [dotCount, currentSlide, slidesToScroll, customPaging, onDotClick]);

  // ============================================================================
  // Render
  // ============================================================================

  const dotsContainer = (
    <ul
      className={dotsClass}
      style={defaultDotsContainerStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {dots}
    </ul>
  );

  // Use custom appendDots if provided
  if (appendDots) {
    return appendDots(dots);
  }

  return dotsContainer;
};

export default Dots;
