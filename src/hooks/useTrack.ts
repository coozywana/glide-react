import { useMemo, useCallback, CSSProperties } from 'react';
import {
  getTrackLeft,
  getTrackCSS,
  getTrackAnimateCSS,
  getPreClones,
  getPostClones,
  getTotalSlides,
  calculateSlideWidth,
} from '../utils/slideUtils';

// ============================================================================
// Types
// ============================================================================

export interface UseTrackOptions {
  /** Current slide index */
  currentSlide: number;
  /** Total number of actual slides (not including clones) */
  slideCount: number;
  /** Number of slides to show at once */
  slidesToShow: number;
  /** Number of slides to scroll per navigation */
  slidesToScroll: number;
  /** Enable infinite looping */
  infinite: boolean;
  /** Enable center mode */
  centerMode: boolean;
  /** Padding for center mode (e.g., "50px" or "10%") */
  centerPadding: string;
  /** Width of the slider container */
  listWidth: number;
  /** Height of the slider container */
  listHeight: number;
  /** Width of a single slide (will be calculated if not provided) */
  slideWidth?: number;
  /** Height of a single slide */
  slideHeight?: number;
  /** Use fade effect instead of sliding */
  fade: boolean;
  /** Vertical slide mode */
  vertical: boolean;
  /** Variable width slides */
  variableWidth: boolean;
  /** Use CSS transforms */
  useTransform: boolean;
  /** Whether slider is disabled */
  disabled: boolean;
  /** Animation speed in ms */
  speed: number;
  /** CSS easing function */
  cssEase: string;
  /** Right-to-left mode */
  rtl: boolean;
  /** Whether currently animating */
  animating: boolean;
  /** Current swipe left position (during drag) */
  swipeLeft: number | null;
}

export interface UseTrackResult {
  /** Calculated width for each slide */
  slideWidth: number;
  /** Style object for the track element */
  trackStyle: CSSProperties;
  /** Number of pre-clone slides needed */
  preCloneCount: number;
  /** Number of post-clone slides needed */
  postCloneCount: number;
  /** Total slides including clones */
  totalSlides: number;
  /** Get track style for a specific slide index (for goToSlide) */
  getTrackStyleForSlide: (slideIndex: number, animate?: boolean) => CSSProperties;
  /** Track width in pixels */
  trackWidth: number;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useTrack(options: UseTrackOptions): UseTrackResult {
  const {
    currentSlide,
    slideCount,
    slidesToShow,
    slidesToScroll,
    infinite,
    centerMode,
    centerPadding,
    listWidth,
    listHeight,
    slideWidth: providedSlideWidth,
    slideHeight = 0,
    fade,
    vertical,
    variableWidth,
    useTransform,
    disabled,
    speed,
    cssEase,
    rtl,
    animating,
    swipeLeft,
  } = options;

  // ============================================================================
  // Calculated Slide Width
  // ============================================================================

  const calculatedSlideWidth = useMemo(() => {
    if (providedSlideWidth && providedSlideWidth > 0) {
      return providedSlideWidth;
    }
    
    if (listWidth <= 0) {
      // Fallback for SSR or before measurement
      return 0;
    }
    
    return calculateSlideWidth(listWidth, slidesToShow, centerMode, centerPadding, vertical);
  }, [providedSlideWidth, listWidth, slidesToShow, centerMode, centerPadding, vertical]);

  // ============================================================================
  // Clone Counts (for infinite mode)
  // ============================================================================

  const preCloneCount = useMemo(() => {
    return getPreClones({
      disabled,
      infinite,
      variableWidth,
      slideCount,
      slidesToShow,
      centerMode,
    });
  }, [disabled, infinite, variableWidth, slideCount, slidesToShow, centerMode]);

  const postCloneCount = useMemo(() => {
    return getPostClones({
      disabled,
      infinite,
      variableWidth,
      slideCount,
      slidesToShow,
      centerMode,
    });
  }, [disabled, infinite, variableWidth, slideCount, slidesToShow, centerMode]);

  const totalSlides = useMemo(() => {
    return getTotalSlides({
      slideCount,
      disabled,
      infinite,
      variableWidth,
      slidesToShow,
      centerMode,
    });
  }, [slideCount, disabled, infinite, variableWidth, slidesToShow, centerMode]);

  // ============================================================================
  // Track Width
  // ============================================================================

  const trackWidth = useMemo(() => {
    if (vertical) {
      return listWidth;
    }
    return totalSlides * calculatedSlideWidth;
  }, [vertical, totalSlides, calculatedSlideWidth, listWidth]);

  // ============================================================================
  // Spec Object (passed to utility functions)
  // ============================================================================

  const spec = useMemo(
    () => ({
      slideIndex: currentSlide,
      infinite,
      centerMode,
      slideCount,
      slidesToShow,
      slidesToScroll,
      slideWidth: calculatedSlideWidth,
      slideHeight,
      fade,
      vertical,
      variableWidth,
      useTransform,
      disabled,
      listWidth,
      centerPadding,
    }),
    [
      currentSlide,
      infinite,
      centerMode,
      slideCount,
      slidesToShow,
      slidesToScroll,
      calculatedSlideWidth,
      slideHeight,
      fade,
      vertical,
      variableWidth,
      useTransform,
      disabled,
      listWidth,
      centerPadding,
    ]
  );

  // ============================================================================
  // Get Track Style for Specific Slide
  // ============================================================================

  const getTrackStyleForSlide = useCallback(
    (slideIndex: number, animate: boolean = false): CSSProperties => {
      const left = getTrackLeft({
        ...spec,
        slideIndex,
      });

      if (animate) {
        return getTrackAnimateCSS({
          ...spec,
          left,
          speed,
          cssEase,
        });
      }

      return getTrackCSS({
        ...spec,
        left,
      });
    },
    [spec, speed, cssEase]
  );

  // ============================================================================
  // Current Track Style
  // ============================================================================

  const trackStyle = useMemo((): CSSProperties => {
    // If currently swiping, use swipeLeft position directly
    if (swipeLeft !== null) {
      return getTrackCSS({
        ...spec,
        left: swipeLeft,
      });
    }

    // Calculate position for current slide
    const left = getTrackLeft({
      ...spec,
      slideIndex: currentSlide,
    });

    // Use animated CSS if currently animating
    if (animating) {
      return getTrackAnimateCSS({
        ...spec,
        left,
        speed,
        cssEase,
      });
    }

    return getTrackCSS({
      ...spec,
      left,
    });
  }, [spec, currentSlide, animating, swipeLeft, speed, cssEase]);

  // ============================================================================
  // Return Values
  // ============================================================================

  return {
    slideWidth: calculatedSlideWidth,
    trackStyle,
    preCloneCount,
    postCloneCount,
    totalSlides,
    getTrackStyleForSlide,
    trackWidth,
  };
}

export default useTrack;
