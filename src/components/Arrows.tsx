import React, { ReactElement, cloneElement, isValidElement } from 'react';
import { canGoNext, canGoPrev } from '../utils/slideUtils';

// ============================================================================
// Types
// ============================================================================

export interface ArrowProps {
  /** Current slide index */
  currentSlide: number;
  /** Total slide count */
  slideCount: number;
  /** Number of slides to show */
  slidesToShow: number;
  /** Enable infinite looping */
  infinite: boolean;
  /** Center mode enabled */
  centerMode: boolean;
  /** Vertical mode enabled */
  vertical: boolean;
  /** Click handler */
  onClick: () => void;
  /** Custom arrow element */
  customArrow?: ReactElement | null;
  /** Direction: 'prev' or 'next' */
  direction: 'prev' | 'next';
}

// ============================================================================
// Default Arrow SVGs
// ============================================================================

const PrevArrowSVG: React.FC<{ className?: string; vertical?: boolean }> = ({ className, vertical }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 20, height: 20 }}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const NextArrowSVG: React.FC<{ className?: string; vertical?: boolean }> = ({ className, vertical }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 20, height: 20 }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ============================================================================
// Arrow Styles
// ============================================================================

const baseArrowStyle: React.CSSProperties = {
  position: 'absolute',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.2s, opacity 0.2s',
};

const disabledArrowStyle: React.CSSProperties = {
  ...baseArrowStyle,
  opacity: 0.3,
  cursor: 'not-allowed',
};

// ============================================================================
// PrevArrow Component
// ============================================================================

export const PrevArrow: React.FC<Omit<ArrowProps, 'direction'>> = ({
  currentSlide,
  slideCount,
  slidesToShow,
  infinite,
  centerMode,
  vertical,
  onClick,
  customArrow,
}) => {
  const canGo = canGoPrev({
    currentSlide,
    infinite,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canGo) {
      onClick();
    }
  };

  // If custom arrow provided, clone it with our props
  if (customArrow && isValidElement(customArrow)) {
    const arrowProps = customArrow.props as { className?: string; style?: React.CSSProperties };
    return cloneElement(customArrow, {
      onClick: handleClick,
      currentSlide,
      slideCount,
      className: `glide-arrow glide-prev ${!canGo ? 'glide-disabled' : ''} ${arrowProps.className || ''}`.trim(),
      style: { ...arrowProps.style },
      'aria-disabled': !canGo,
    } as React.HTMLAttributes<HTMLElement>);
  }

  // Default arrow
  return (
    <button
      type="button"
      className={`glide-arrow glide-prev ${!canGo ? 'glide-disabled' : ''}`}
      style={{
        ...(canGo ? baseArrowStyle : disabledArrowStyle),
        left: 10,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      onClick={handleClick}
      aria-label="Previous slide"
      aria-disabled={!canGo}
      disabled={!canGo}
    >
      <PrevArrowSVG vertical={vertical} />
    </button>
  );
};

// ============================================================================
// NextArrow Component
// ============================================================================

export const NextArrow: React.FC<Omit<ArrowProps, 'direction'>> = ({
  currentSlide,
  slideCount,
  slidesToShow,
  infinite,
  centerMode,
  vertical,
  onClick,
  customArrow,
}) => {
  const canGo = canGoNext({
    currentSlide,
    slideCount,
    slidesToShow,
    infinite,
    centerMode,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canGo) {
      onClick();
    }
  };

  // If custom arrow provided, clone it with our props
  if (customArrow && isValidElement(customArrow)) {
    const arrowProps = customArrow.props as { className?: string; style?: React.CSSProperties };
    return cloneElement(customArrow, {
      onClick: handleClick,
      currentSlide,
      slideCount,
      className: `glide-arrow glide-next ${!canGo ? 'glide-disabled' : ''} ${arrowProps.className || ''}`.trim(),
      style: { ...arrowProps.style },
      'aria-disabled': !canGo,
    } as React.HTMLAttributes<HTMLElement>);
  }

  // Default arrow
  return (
    <button
      type="button"
      className={`glide-arrow glide-next ${!canGo ? 'glide-disabled' : ''}`}
      style={{
        ...(canGo ? baseArrowStyle : disabledArrowStyle),
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      onClick={handleClick}
      aria-label="Next slide"
      aria-disabled={!canGo}
      disabled={!canGo}
    >
      <NextArrowSVG vertical={vertical} />
    </button>
  );
};
