import React, {
  CSSProperties,
  ReactNode,
  ReactElement,
  Children,
  cloneElement,
  isValidElement,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import {
  getSlideClasses,
  getPreClones,
  getPostClones,
  lazyStartIndex,
  lazyEndIndex,
} from '../utils/slideUtils';

// ============================================================================
// Types
// ============================================================================

export interface TrackProps {
  /** Track inline styles (transform, width, transition) */
  trackStyle: CSSProperties;
  /** Width of each slide */
  slideWidth: number;
  /** Height of each slide (for vertical mode) */
  slideHeight?: number;
  /** Total number of actual slides */
  slideCount: number;
  /** Current active slide index */
  currentSlide: number;
  /** Target slide during animation */
  targetSlide: number;
  /** Number of slides to show */
  slidesToShow: number;
  /** Number of slides to scroll */
  slidesToScroll: number;
  /** Enable infinite looping */
  infinite: boolean;
  /** Enable center mode */
  centerMode: boolean;
  /** Center mode padding */
  centerPadding: string;
  /** Use fade effect */
  fade: boolean;
  /** Vertical mode */
  vertical: boolean;
  /** Variable width mode */
  variableWidth: boolean;
  /** Right-to-left mode */
  rtl: boolean;
  /** Whether slider is disabled */
  disabled: boolean;
  /** Lazy load mode */
  lazyLoad: 'ondemand' | 'progressive' | null;
  /** List of lazy loaded slide indices */
  lazyLoadedList: number[];
  /** Animation speed */
  speed: number;
  /** CSS easing function */
  cssEase: string;
  /** Use CSS transforms */
  useCSS: boolean;
  /** Children (slides) */
  children: ReactNode;
  /** Click handler for focusOnSelect */
  onSlideClick?: (index: number) => void;
  /** Enable focus on select */
  focusOnSelect: boolean;
  /** Mouse enter handler (for pause on hover) */
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  /** Mouse over handler */
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>;
  /** Mouse leave handler (for resume autoplay) */
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

// ============================================================================
// Slide Style Calculation
// ============================================================================

const getSlideStyle = (spec: {
  index: number;
  slideWidth: number;
  slideHeight?: number;
  fade: boolean;
  vertical: boolean;
  variableWidth: boolean;
  currentSlide: number;
  speed: number;
  cssEase: string;
  useCSS: boolean;
}): CSSProperties => {
  const style: CSSProperties = {};

  // Set width unless variable width mode
  if (!spec.variableWidth) {
    style.width = spec.slideWidth;
  }

  // Fade mode styling
  if (spec.fade) {
    style.position = 'relative';
    
    if (spec.vertical) {
      style.top = -spec.index * (spec.slideHeight || 0);
    } else {
      style.left = -spec.index * spec.slideWidth;
    }
    
    style.opacity = spec.currentSlide === spec.index ? 1 : 0;
    style.zIndex = spec.currentSlide === spec.index ? 999 : 998;
    
    if (spec.useCSS) {
      style.transition = `opacity ${spec.speed}ms ${spec.cssEase}, visibility ${spec.speed}ms ${spec.cssEase}`;
    }
  }

  return style;
};

// ============================================================================
// Get Child Key
// ============================================================================

const getKey = (child: ReactNode, fallbackKey: number | string): string | number => {
  if (isValidElement(child) && child.key !== null) {
    return child.key;
  }
  return fallbackKey;
};

// ============================================================================
// Build Class String from Class Object
// ============================================================================

const classNames = (classes: Record<string, boolean>): string => {
  return Object.entries(classes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
};

// ============================================================================
// Track Component
// ============================================================================

export const Track = forwardRef<HTMLDivElement, TrackProps>(function Track(
  {
    trackStyle,
    slideWidth,
    slideHeight,
    slideCount,
    currentSlide,
    targetSlide,
    slidesToShow,
    slidesToScroll,
    infinite,
    centerMode,
    centerPadding,
    fade,
    vertical,
    variableWidth,
    rtl,
    disabled,
    lazyLoad,
    lazyLoadedList,
    speed,
    cssEase,
    useCSS,
    children,
    onSlideClick,
    focusOnSelect,
    onMouseEnter,
    onMouseOver,
    onMouseLeave,
  },
  ref
) {
  // ============================================================================
  // Spec Object (for utility functions)
  // ============================================================================

  const spec = useMemo(
    () => ({
      slideCount,
      slidesToShow,
      slidesToScroll,
      currentSlide,
      targetSlide,
      centerMode,
      centerPadding,
      infinite,
      rtl,
      fade,
      vertical,
      variableWidth,
      disabled,
    }),
    [
      slideCount,
      slidesToShow,
      slidesToScroll,
      currentSlide,
      targetSlide,
      centerMode,
      centerPadding,
      infinite,
      rtl,
      fade,
      vertical,
      variableWidth,
      disabled,
    ]
  );

  // ============================================================================
  // Lazy Load Indices
  // ============================================================================

  const startIndex = useMemo(
    () => lazyStartIndex({ currentSlide, centerMode, slidesToShow, centerPadding }),
    [currentSlide, centerMode, slidesToShow, centerPadding]
  );

  const endIndex = useMemo(
    () => lazyEndIndex({ currentSlide, centerMode, slidesToShow, centerPadding }),
    [currentSlide, centerMode, slidesToShow, centerPadding]
  );

  // ============================================================================
  // Clone Counts
  // ============================================================================

  const preCloneCount = useMemo(() => getPreClones(spec), [spec]);
  const postCloneCount = useMemo(() => getPostClones(spec), [spec]);

  // ============================================================================
  // Slide Click Handler
  // ============================================================================

  const handleSlideClick = useCallback(
    (index: number, originalOnClick?: React.MouseEventHandler) => (e: React.MouseEvent) => {
      // Call original onClick if exists
      if (originalOnClick) {
        originalOnClick(e);
      }
      // Handle focusOnSelect
      if (focusOnSelect && onSlideClick) {
        onSlideClick(index);
      }
    },
    [focusOnSelect, onSlideClick]
  );

  // ============================================================================
  // Render Slides
  // ============================================================================

  const slides = useMemo(() => {
    const output: ReactElement[] = [];
    const preCloneSlides: ReactElement[] = [];
    const postCloneSlides: ReactElement[] = [];

    const childrenArray = Children.toArray(children);
    const childrenCount = childrenArray.length;

    childrenArray.forEach((elem, index) => {
      if (!isValidElement(elem)) return;

      // Determine if slide should be lazy loaded
      let child: ReactElement = elem;
      if (lazyLoad) {
        const shouldLoad = lazyLoadedList.includes(index);
        if (!shouldLoad) {
          // Render placeholder for lazy loading
          child = <div /> as ReactElement;
        }
      }

      // Calculate slide styles
      const childStyle = getSlideStyle({
        index,
        slideWidth,
        slideHeight,
        fade,
        vertical,
        variableWidth,
        currentSlide,
        speed,
        cssEase,
        useCSS,
      });

      // Get slide classes
      const slideClasses = getSlideClasses({
        index,
        currentSlide,
        slideCount,
        slidesToShow,
        centerMode,
        targetSlide,
        rtl,
      });

      // Merge with existing className
      const existingClassName = (elem.props as { className?: string }).className || '';
      const className = `${classNames(slideClasses)} ${existingClassName}`.trim();

      // Get original onClick
      const originalOnClick = (elem.props as { onClick?: React.MouseEventHandler }).onClick;

      // Clone element with new props
      output.push(
        cloneElement(child, {
          key: `original${getKey(child, index)}`,
          'data-index': index,
          className,
          tabIndex: -1,
          'aria-hidden': !slideClasses['glide-active'],
          style: {
            outline: 'none',
            ...(elem.props as { style?: CSSProperties }).style,
            ...childStyle,
          },
          onClick: handleSlideClick(index, originalOnClick),
        })
      );

      // ============================================================================
      // Clone Logic for Infinite Mode
      // ============================================================================

      if (infinite && childrenCount > 1 && !fade && !disabled) {
        // Pre-clones: Clone last N slides at beginning
        const preCloneNo = childrenCount - index;
        if (preCloneNo <= preCloneCount) {
          const key = -preCloneNo;
          
          // Check if this clone should be lazy loaded
          let cloneChild = elem;
          if (lazyLoad && key >= startIndex) {
            cloneChild = elem;
          } else if (lazyLoad) {
            cloneChild = <div /> as ReactElement;
          }

          const cloneClasses = getSlideClasses({
            index: key,
            currentSlide,
            slideCount,
            slidesToShow,
            centerMode,
            targetSlide,
            rtl,
          });

          preCloneSlides.push(
            cloneElement(cloneChild, {
              key: `precloned${getKey(cloneChild, key)}`,
              'data-index': key,
              tabIndex: -1,
              className: `${classNames(cloneClasses)} ${existingClassName}`.trim(),
              'aria-hidden': !cloneClasses['glide-active'],
              style: {
                ...(elem.props as { style?: CSSProperties }).style,
                ...childStyle,
              },
              onClick: handleSlideClick(index, originalOnClick),
            })
          );
        }

        // Post-clones: Clone first N slides at end
        if (index < postCloneCount) {
          const key = childrenCount + index;
          
          // Check if this clone should be lazy loaded
          let cloneChild = elem;
          if (lazyLoad && key < endIndex) {
            cloneChild = elem;
          } else if (lazyLoad) {
            cloneChild = <div /> as ReactElement;
          }

          const cloneClasses = getSlideClasses({
            index: key,
            currentSlide,
            slideCount,
            slidesToShow,
            centerMode,
            targetSlide,
            rtl,
          });

          postCloneSlides.push(
            cloneElement(cloneChild, {
              key: `postcloned${getKey(cloneChild, key)}`,
              'data-index': key,
              tabIndex: -1,
              className: `${classNames(cloneClasses)} ${existingClassName}`.trim(),
              'aria-hidden': !cloneClasses['glide-active'],
              style: {
                ...(elem.props as { style?: CSSProperties }).style,
                ...childStyle,
              },
              onClick: handleSlideClick(index, originalOnClick),
            })
          );
        }
      }
    });

    // Combine: preClones + originals + postClones
    let result = preCloneSlides.concat(output, postCloneSlides);

    // Reverse for RTL
    if (rtl) {
      result = result.reverse();
    }

    return result;
  }, [
    children,
    slideWidth,
    slideHeight,
    slideCount,
    currentSlide,
    targetSlide,
    slidesToShow,
    slidesToScroll,
    infinite,
    centerMode,
    centerPadding,
    fade,
    vertical,
    variableWidth,
    rtl,
    disabled,
    lazyLoad,
    lazyLoadedList,
    speed,
    cssEase,
    useCSS,
    preCloneCount,
    postCloneCount,
    startIndex,
    endIndex,
    handleSlideClick,
  ]);

  // ============================================================================
  // Base Track Styles
  // ============================================================================

  const baseTrackStyle: CSSProperties = {
    position: 'relative',
    display: fade ? 'block' : 'flex',
    flexDirection: vertical ? 'column' : 'row',
    ...trackStyle,
  };

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div
      ref={ref}
      className="glide-track"
      style={baseTrackStyle}
      onMouseEnter={onMouseEnter}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {slides}
    </div>
  );
});

export default Track;
