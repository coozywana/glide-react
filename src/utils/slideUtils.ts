import { CSSProperties } from 'react';
import { TouchObject, SwipeDirection, GlideSettings, SlideSpec } from '../types';

// ============================================================================
// DOM Utilities
// ============================================================================

/**
 * Check if we're running in a browser environment
 */
export const canUseDOM = (): boolean =>
  !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );

/**
 * Get the width of an element
 */
export const getWidth = (elem: HTMLElement | null): number =>
  (elem && elem.offsetWidth) || 0;

/**
 * Get the height of an element
 */
export const getHeight = (elem: HTMLElement | null): number =>
  (elem && elem.offsetHeight) || 0;

// ============================================================================
// Math Utilities
// ============================================================================

/**
 * Clamp a number between lower and upper bounds
 */
export function clamp(number: number, lowerBound: number, upperBound: number): number {
  return Math.max(lowerBound, Math.min(number, upperBound));
}

// ============================================================================
// Clone Count Calculations
// ============================================================================

/**
 * Get the number of pre-clones needed for infinite scrolling
 * Pre-clones are placed BEFORE original slides (last N slides cloned at beginning)
 */
export const getPreClones = (spec: Partial<SlideSpec>): number => {
  if (spec.disabled || !spec.infinite) {
    return 0;
  }
  if (spec.variableWidth) {
    return spec.slideCount || 0;
  }
  return (spec.slidesToShow || 1) + (spec.centerMode ? 1 : 0);
};

/**
 * Get the number of post-clones needed for infinite scrolling
 * Post-clones are placed AFTER original slides (first N slides cloned at end)
 */
export const getPostClones = (spec: Partial<SlideSpec>): number => {
  if (spec.disabled || !spec.infinite) {
    return 0;
  }
  if (spec.variableWidth) {
    return spec.slideCount || 0;
  }
  return (spec.slidesToShow || 1) + (spec.centerMode ? 1 : 0);
};

/**
 * Get total number of slides including clones
 */
export const getTotalSlides = (spec: Partial<SlideSpec>): number => {
  if (spec.slideCount === 1) {
    return 1;
  }
  return getPreClones(spec) + (spec.slideCount || 0) + getPostClones(spec);
};

// ============================================================================
// Navigation Logic
// ============================================================================

/**
 * Check if we can navigate to the next slide
 */
export const canGoNext = (spec: Partial<SlideSpec>): boolean => {
  if (spec.infinite) {
    return true;
  }
  
  const currentSlide = spec.currentSlide || 0;
  const slideCount = spec.slideCount || 0;
  const slidesToShow = spec.slidesToShow || 1;
  
  if (spec.centerMode && currentSlide >= slideCount - 1) {
    return false;
  }
  
  if (slideCount <= slidesToShow || currentSlide >= slideCount - slidesToShow) {
    return false;
  }
  
  return true;
};

/**
 * Check if we can navigate to the previous slide
 */
export const canGoPrev = (spec: Partial<SlideSpec>): boolean => {
  if (spec.infinite) {
    return true;
  }
  
  const currentSlide = spec.currentSlide || 0;
  
  if (currentSlide <= 0) {
    return false;
  }
  
  return true;
};

// ============================================================================
// Swipe/Touch Detection
// ============================================================================

/**
 * Get the swipe direction based on touch coordinates
 */
export const getSwipeDirection = (
  touchObject: TouchObject,
  verticalSwiping: boolean = false
): SwipeDirection => {
  const xDist = touchObject.startX - touchObject.curX;
  const yDist = touchObject.startY - touchObject.curY;
  const r = Math.atan2(yDist, xDist);
  let swipeAngle = Math.round((r * 180) / Math.PI);
  
  if (swipeAngle < 0) {
    swipeAngle = 360 - Math.abs(swipeAngle);
  }
  
  // Left swipe: 0-45° or 315-360°
  if ((swipeAngle <= 45 && swipeAngle >= 0) || (swipeAngle <= 360 && swipeAngle >= 315)) {
    return 'left';
  }
  
  // Right swipe: 135-225°
  if (swipeAngle >= 135 && swipeAngle <= 225) {
    return 'right';
  }
  
  // Vertical swipes
  if (verticalSwiping) {
    if (swipeAngle >= 35 && swipeAngle <= 135) {
      return 'up';
    }
    return 'down';
  }
  
  return 'vertical';
};

/**
 * Safely prevent default on events (respects passive event listeners)
 */
export const safePreventDefault = (event: Event | React.SyntheticEvent): void => {
  const passiveEvents = ['onTouchStart', 'onTouchMove', 'onWheel'];
  
  // Check if this is a React synthetic event with _reactName property
  const reactEvent = event as React.SyntheticEvent & { _reactName?: string };
  
  if (reactEvent._reactName && !passiveEvents.includes(reactEvent._reactName)) {
    event.preventDefault();
  } else if (!reactEvent._reactName) {
    // Native event - try to prevent default
    try {
      event.preventDefault();
    } catch {
      // Event might be non-cancelable
    }
  }
};

// ============================================================================
// Swipe/Touch Handlers
// ============================================================================

export interface SwipeStartResult {
  dragging: boolean;
  touchObject: TouchObject;
}

/**
 * Handle swipe/drag start
 */
export const swipeStart = (
  e: React.MouseEvent | React.TouchEvent,
  swipe: boolean,
  draggable: boolean
): SwipeStartResult | null => {
  // Prevent drag on images
  if ((e.target as HTMLElement).tagName === 'IMG') {
    safePreventDefault(e);
  }
  
  // Check if swipe/drag is enabled
  if (!swipe || (!draggable && e.type.indexOf('mouse') !== -1)) {
    return null;
  }
  
  const touches = 'touches' in e ? e.touches : null;
  
  return {
    dragging: true,
    touchObject: {
      startX: touches ? touches[0].pageX : (e as React.MouseEvent).clientX,
      startY: touches ? touches[0].pageY : (e as React.MouseEvent).clientY,
      curX: touches ? touches[0].pageX : (e as React.MouseEvent).clientX,
      curY: touches ? touches[0].pageY : (e as React.MouseEvent).clientY,
    },
  };
};

export interface SwipeMoveResult {
  touchObject: TouchObject;
  swipeLeft: number;
  trackStyle: CSSProperties;
  swiping?: boolean;
  scrolling?: boolean;
  edgeDragged?: boolean;
  swiped?: boolean;
}

/**
 * Handle swipe/drag move
 */
export const swipeMove = (
  e: React.MouseEvent | React.TouchEvent,
  spec: {
    scrolling: boolean;
    animating: boolean;
    vertical: boolean;
    swipeToSlide: boolean;
    verticalSwiping: boolean;
    rtl: boolean;
    currentSlide: number;
    edgeFriction: number;
    edgeDragged: boolean;
    onEdge?: (direction: SwipeDirection) => void;
    swiped: boolean;
    swiping: boolean;
    slideCount: number;
    slidesToScroll: number;
    infinite: boolean;
    touchObject: TouchObject;
    swipeEvent?: (direction: SwipeDirection) => void;
    listHeight: number;
    listWidth: number;
    slideWidth: number;
    slideHeight: number;
    centerMode: boolean;
    slidesToShow: number;
    fade: boolean;
    disabled: boolean;
    variableWidth: boolean;
    useTransform: boolean;
  }
): SwipeMoveResult | { scrolling: true } | null => {
  const {
    scrolling,
    animating,
    vertical,
    swipeToSlide,
    verticalSwiping,
    rtl,
    currentSlide,
    edgeFriction,
    edgeDragged,
    onEdge,
    swiped,
    swiping,
    slideCount,
    slidesToScroll,
    infinite,
    touchObject,
    swipeEvent,
    listHeight,
    listWidth,
  } = spec;
  
  if (scrolling) return null;
  if (animating) {
    safePreventDefault(e);
    return null;
  }
  
  if (vertical && swipeToSlide && verticalSwiping) {
    safePreventDefault(e);
  }
  
  const touches = 'touches' in e ? e.touches : null;
  const newTouchObject: TouchObject = {
    ...touchObject,
    curX: touches ? touches[0].pageX : (e as React.MouseEvent).clientX,
    curY: touches ? touches[0].pageY : (e as React.MouseEvent).clientY,
  };
  
  newTouchObject.swipeLength = Math.round(
    Math.sqrt(Math.pow(newTouchObject.curX - newTouchObject.startX, 2))
  );
  
  const verticalSwipeLength = Math.round(
    Math.sqrt(Math.pow(newTouchObject.curY - newTouchObject.startY, 2))
  );
  
  // If scrolling vertically, don't interfere
  if (!verticalSwiping && !swiping && verticalSwipeLength > 10) {
    return { scrolling: true };
  }
  
  if (verticalSwiping) {
    newTouchObject.swipeLength = verticalSwipeLength;
  }
  
  let positionOffset = (!rtl ? 1 : -1) * (newTouchObject.curX > newTouchObject.startX ? 1 : -1);
  if (verticalSwiping) {
    positionOffset = newTouchObject.curY > newTouchObject.startY ? 1 : -1;
  }
  
  const dotCount = Math.ceil(slideCount / slidesToScroll);
  const swipeDirection = getSwipeDirection(newTouchObject, verticalSwiping);
  let touchSwipeLength = newTouchObject.swipeLength;
  
  const state: Partial<SwipeMoveResult> = {};
  
  // Apply edge friction when at boundaries (non-infinite mode)
  if (!infinite) {
    if (
      (currentSlide === 0 && (swipeDirection === 'right' || swipeDirection === 'down')) ||
      (currentSlide + 1 >= dotCount && (swipeDirection === 'left' || swipeDirection === 'up')) ||
      (!canGoNext(spec) && (swipeDirection === 'left' || swipeDirection === 'up'))
    ) {
      touchSwipeLength = newTouchObject.swipeLength * edgeFriction;
      if (edgeDragged === false && onEdge) {
        onEdge(swipeDirection);
        state.edgeDragged = true;
      }
    }
  }
  
  if (!swiped && swipeEvent) {
    swipeEvent(swipeDirection);
    state.swiped = true;
  }
  
  // Calculate current track position
  const curLeft = getTrackLeft({
    ...spec,
    slideIndex: currentSlide,
  });
  
  // Calculate new swipe position
  let swipeLeft: number;
  if (!vertical) {
    if (!rtl) {
      swipeLeft = curLeft + touchSwipeLength * positionOffset;
    } else {
      swipeLeft = curLeft - touchSwipeLength * positionOffset;
    }
  } else {
    swipeLeft = curLeft + touchSwipeLength * (listHeight / listWidth) * positionOffset;
  }
  
  if (verticalSwiping) {
    swipeLeft = curLeft + touchSwipeLength * positionOffset;
  }
  
  const trackStyle = getTrackCSS({
    ...spec,
    left: swipeLeft,
  });
  
  // Trigger swiping state if threshold exceeded
  if (
    Math.abs(newTouchObject.curX - newTouchObject.startX) <
    Math.abs(newTouchObject.curY - newTouchObject.startY) * 0.8
  ) {
    return {
      ...state,
      touchObject: newTouchObject,
      swipeLeft,
      trackStyle,
    };
  }
  
  if (newTouchObject.swipeLength > 10) {
    state.swiping = true;
    safePreventDefault(e);
  }
  
  return {
    ...state,
    touchObject: newTouchObject,
    swipeLeft,
    trackStyle,
  };
};

export interface SwipeEndResult {
  dragging: boolean;
  edgeDragged: boolean;
  scrolling: boolean;
  swiping: boolean;
  swiped: boolean;
  swipeLeft: null;
  touchObject: TouchObject;
  trackStyle?: CSSProperties;
  triggerSlideHandler?: number;
  currentDirection?: number;
}

/**
 * Handle swipe/drag end
 */
export const swipeEnd = (
  e: React.MouseEvent | React.TouchEvent,
  spec: {
    dragging: boolean;
    swipe: boolean;
    touchObject: TouchObject;
    listWidth: number;
    touchThreshold: number;
    verticalSwiping: boolean;
    listHeight: number;
    swipeToSlide: boolean;
    scrolling: boolean;
    onSwipe?: (direction: SwipeDirection) => void;
    targetSlide: number;
    currentSlide: number;
    infinite: boolean;
    slideCount: number;
    slidesToScroll: number;
    slidesToShow: number;
    slideWidth: number;
    slideHeight: number;
    centerMode: boolean;
    fade: boolean;
    disabled: boolean;
    variableWidth: boolean;
    useTransform: boolean;
    speed: number;
    cssEase: string;
    rtl: boolean;
    vertical: boolean;
  }
): SwipeEndResult => {
  const {
    dragging,
    swipe,
    touchObject,
    listWidth,
    touchThreshold,
    verticalSwiping,
    listHeight,
    swipeToSlide,
    scrolling,
    onSwipe,
    currentSlide,
    infinite,
  } = spec;
  
  const emptyTouchObject: TouchObject = { startX: 0, startY: 0, curX: 0, curY: 0 };
  
  // Reset state
  const state: SwipeEndResult = {
    dragging: false,
    edgeDragged: false,
    scrolling: false,
    swiping: false,
    swiped: false,
    swipeLeft: null,
    touchObject: emptyTouchObject,
  };
  
  if (!dragging) {
    if (swipe) safePreventDefault(e);
    return state;
  }
  
  if (scrolling) {
    return state;
  }
  
  if (!touchObject.swipeLength) {
    return state;
  }
  
  // Calculate minimum swipe distance
  const minSwipe = verticalSwiping
    ? listHeight / touchThreshold
    : listWidth / touchThreshold;
  
  const swipeDirection = getSwipeDirection(touchObject, verticalSwiping);
  
  if (touchObject.swipeLength > minSwipe) {
    safePreventDefault(e);
    
    if (onSwipe) {
      onSwipe(swipeDirection);
    }
    
    let newSlide: number;
    const activeSlide = infinite ? currentSlide : spec.targetSlide;
    const slideCount = getSlideCount(spec);
    
    switch (swipeDirection) {
      case 'left':
      case 'up':
        newSlide = activeSlide + slideCount;
        if (swipeToSlide) {
          newSlide = checkNavigable(spec, newSlide);
        }
        state.triggerSlideHandler = newSlide;
        state.currentDirection = 0;
        break;
      case 'right':
      case 'down':
        newSlide = activeSlide - slideCount;
        if (swipeToSlide) {
          newSlide = checkNavigable(spec, newSlide);
        }
        state.triggerSlideHandler = newSlide;
        state.currentDirection = 1;
        break;
      default:
        state.triggerSlideHandler = activeSlide;
    }
  } else {
    // Snap back to current position
    const currentLeft = getTrackLeft({
      ...spec,
      slideIndex: currentSlide,
    });
    state.trackStyle = getTrackAnimateCSS({
      ...spec,
      left: currentLeft,
    });
  }
  
  return state;
};

// ============================================================================
// Slide Count Calculation (for swipe-to-slide)
// ============================================================================

/**
 * Calculate the number of slides to move based on swipe distance
 */
const getSlideCount = (spec: {
  centerMode: boolean;
  slideWidth: number;
  slidesToShow: number;
  swipeToSlide: boolean;
  slidesToScroll: number;
}): number => {
  if (spec.swipeToSlide) {
    // For swipeToSlide mode, we'd normally calculate based on swipe distance
    // Simplified: just return 1 slide
    return 1;
  }
  return spec.slidesToScroll;
};

/**
 * Get navigable slide indexes for slidesToScroll alignment
 */
const getNavigableIndexes = (spec: {
  infinite: boolean;
  slideCount: number;
  slidesToShow: number;
  slidesToScroll: number;
}): number[] => {
  const max = spec.infinite ? spec.slideCount * 2 : spec.slideCount;
  const breakpointStart = spec.infinite ? spec.slidesToShow * -1 : 0;
  let counter = breakpointStart;
  const indexes: number[] = [];
  let breakpoint = breakpointStart;
  
  while (breakpoint < max) {
    indexes.push(breakpoint);
    breakpoint = counter + spec.slidesToScroll;
    counter += Math.min(spec.slidesToScroll, spec.slidesToShow);
  }
  
  return indexes;
};

/**
 * Find the nearest navigable slide index
 */
const checkNavigable = (
  spec: {
    infinite: boolean;
    slideCount: number;
    slidesToShow: number;
    slidesToScroll: number;
  },
  index: number
): number => {
  const navigables = getNavigableIndexes(spec);
  let prevNavigable = 0;
  
  if (index > navigables[navigables.length - 1]) {
    return navigables[navigables.length - 1];
  }
  
  for (const nav of navigables) {
    if (index < nav) {
      return prevNavigable;
    }
    prevNavigable = nav;
  }
  
  return index;
};

// ============================================================================
// Track Position & Style Calculations
// ============================================================================

/**
 * Calculate the track's left/top offset for a given slide index
 */
export const getTrackLeft = (spec: {
  slideIndex: number;
  infinite: boolean;
  centerMode: boolean;
  slideCount: number;
  slidesToShow: number;
  slidesToScroll: number;
  slideWidth: number;
  slideHeight: number;
  fade: boolean;
  vertical: boolean;
  variableWidth: boolean;
  disabled: boolean;
  trackRef?: HTMLDivElement | null;
  listWidth?: number;
  centerPadding?: string;
}): number => {
  if (spec.disabled) {
    return 0;
  }
  
  const {
    slideIndex,
    infinite,
    centerMode,
    slideCount,
    slidesToShow,
    slidesToScroll,
    slideWidth,
    slideHeight,
    fade,
    vertical,
  } = spec;
  
  // Fade mode doesn't use track positioning
  if (fade || slideCount === 1) {
    return 0;
  }
  
  let slidesToOffset = 0;
  
  if (infinite) {
    // Bring active slide to the beginning of visual area
    slidesToOffset = -getPreClones(spec as Partial<SlideSpec>);
    
    // Handle uneven slide counts at end
    if (slideCount % slidesToScroll !== 0 && slideIndex + slidesToScroll > slideCount) {
      slidesToOffset = -(
        slideIndex > slideCount
          ? slidesToShow - (slideIndex - slideCount)
          : slideCount % slidesToScroll
      );
    }
    
    // Shift current slide to center of frame
    if (centerMode) {
      slidesToOffset += Math.floor(slidesToShow / 2);
    }
  } else {
    // Finite mode
    if (slideCount % slidesToScroll !== 0 && slideIndex + slidesToScroll > slideCount) {
      slidesToOffset = slidesToShow - (slideCount % slidesToScroll);
    }
    if (centerMode) {
      slidesToOffset = Math.floor(slidesToShow / 2);
    }
  }
  
  const slideOffset = slidesToOffset * slideWidth;
  const verticalOffset = slidesToOffset * slideHeight;
  
  let targetLeft: number;
  if (!vertical) {
    targetLeft = slideIndex * slideWidth * -1 + slideOffset;
  } else {
    targetLeft = slideIndex * slideHeight * -1 + verticalOffset;
  }
  
  return targetLeft;
};

/**
 * Generate track CSS styles (non-animated)
 */
export const getTrackCSS = (spec: {
  left: number;
  variableWidth: boolean;
  slideCount: number;
  slidesToShow: number;
  slideWidth: number;
  slideHeight?: number;
  vertical: boolean;
  fade: boolean;
  useTransform: boolean;
  infinite: boolean;
  centerMode: boolean;
  disabled: boolean;
}): CSSProperties => {
  let trackWidth: number | undefined;
  let trackHeight: number | undefined;
  
  const totalSlides = getTotalSlides(spec as Partial<SlideSpec>);
  
  if (!spec.vertical) {
    trackWidth = totalSlides * spec.slideWidth;
  } else {
    const trackChildren = spec.disabled
      ? spec.slideCount
      : spec.slideCount + 2 * spec.slidesToShow;
    trackHeight = trackChildren * (spec.slideHeight || 0);
  }
  
  let style: CSSProperties = {
    opacity: 1,
    transition: '',
    WebkitTransition: '',
  };
  
  if (spec.useTransform) {
    const transform = !spec.vertical
      ? `translate3d(${spec.left}px, 0px, 0px)`
      : `translate3d(0px, ${spec.left}px, 0px)`;
    const msTransform = !spec.vertical
      ? `translateX(${spec.left}px)`
      : `translateY(${spec.left}px)`;
    
    style = {
      ...style,
      WebkitTransform: transform,
      transform,
      msTransform,
    } as CSSProperties;
  } else {
    if (spec.vertical) {
      style.top = spec.left;
    } else {
      style.left = spec.left;
    }
  }
  
  if (spec.fade) {
    style = { opacity: 1 };
  }
  
  if (trackWidth) {
    style.width = trackWidth;
  }
  if (trackHeight) {
    style.height = trackHeight;
  }
  
  return style;
};

/**
 * Generate track CSS styles (animated)
 */
export const getTrackAnimateCSS = (spec: {
  left: number;
  variableWidth: boolean;
  slideCount: number;
  slidesToShow: number;
  slideWidth: number;
  slideHeight?: number;
  vertical: boolean;
  fade: boolean;
  useTransform: boolean;
  infinite: boolean;
  centerMode: boolean;
  disabled: boolean;
  speed: number;
  cssEase: string;
}): CSSProperties => {
  const style = getTrackCSS(spec);
  
  if (spec.useTransform) {
    style.WebkitTransition = `-webkit-transform ${spec.speed}ms ${spec.cssEase}`;
    style.transition = `transform ${spec.speed}ms ${spec.cssEase}`;
  } else {
    if (spec.vertical) {
      style.transition = `top ${spec.speed}ms ${spec.cssEase}`;
    } else {
      style.transition = `left ${spec.speed}ms ${spec.cssEase}`;
    }
  }
  
  return style;
};

// ============================================================================
// Dimension Calculation
// ============================================================================

/**
 * Calculate slide width based on container and settings
 */
export const calculateSlideWidth = (
  listWidth: number,
  slidesToShow: number,
  centerMode: boolean,
  centerPadding: string,
  vertical: boolean
): number => {
  if (vertical) {
    return listWidth;
  }
  
  let centerPaddingAdj = 0;
  if (centerMode) {
    const paddingValue = parseInt(centerPadding, 10) || 0;
    centerPaddingAdj = paddingValue * 2;
    
    // Handle percentage padding
    if (centerPadding.endsWith('%')) {
      centerPaddingAdj = (listWidth * paddingValue * 2) / 100;
    }
  }
  
  return Math.ceil((listWidth - centerPaddingAdj) / slidesToShow);
};

// ============================================================================
// Keyboard Navigation
// ============================================================================

/**
 * Handle keyboard input for slide navigation
 */
export const keyHandler = (
  e: React.KeyboardEvent,
  accessibility: boolean,
  rtl: boolean
): 'next' | 'previous' | '' => {
  // Ignore if typing in form fields
  if ((e.target as HTMLElement).tagName.match(/TEXTAREA|INPUT|SELECT/) || !accessibility) {
    return '';
  }
  
  // Arrow key navigation
  if (e.keyCode === 37) {
    return rtl ? 'next' : 'previous';
  }
  if (e.keyCode === 39) {
    return rtl ? 'previous' : 'next';
  }
  
  return '';
};

// ============================================================================
// Lazy Loading
// ============================================================================

/**
 * Calculate start index for lazy loading
 */
export const lazyStartIndex = (spec: {
  currentSlide: number;
  centerMode: boolean;
  slidesToShow: number;
  centerPadding?: string;
}): number => {
  return spec.currentSlide - lazySlidesOnLeft(spec);
};

/**
 * Calculate end index for lazy loading
 */
export const lazyEndIndex = (spec: {
  currentSlide: number;
  centerMode: boolean;
  slidesToShow: number;
  centerPadding?: string;
}): number => {
  return spec.currentSlide + lazySlidesOnRight(spec);
};

/**
 * Calculate slides to load on left of current slide
 */
export const lazySlidesOnLeft = (spec: {
  centerMode: boolean;
  slidesToShow: number;
  centerPadding?: string;
}): number => {
  if (spec.centerMode) {
    return Math.floor(spec.slidesToShow / 2) + (parseInt(spec.centerPadding || '0', 10) > 0 ? 1 : 0);
  }
  return 0;
};

/**
 * Calculate slides to load on right of current slide
 */
export const lazySlidesOnRight = (spec: {
  centerMode: boolean;
  slidesToShow: number;
  centerPadding?: string;
}): number => {
  if (spec.centerMode) {
    return (
      Math.floor((spec.slidesToShow - 1) / 2) +
      1 +
      (parseInt(spec.centerPadding || '0', 10) > 0 ? 1 : 0)
    );
  }
  return spec.slidesToShow;
};

/**
 * Get on-demand lazy load slides
 */
export const getOnDemandLazySlides = (spec: {
  currentSlide: number;
  centerMode: boolean;
  slidesToShow: number;
  centerPadding?: string;
  lazyLoadedList: number[];
}): number[] => {
  const onDemandSlides: number[] = [];
  const startIndex = lazyStartIndex(spec);
  const endIndex = lazyEndIndex(spec);
  
  for (let slideIndex = startIndex; slideIndex < endIndex; slideIndex++) {
    if (!spec.lazyLoadedList.includes(slideIndex)) {
      onDemandSlides.push(slideIndex);
    }
  }
  
  return onDemandSlides;
};

// ============================================================================
// Slide Class Calculation
// ============================================================================

export interface SlideClasses {
  'glide-slide': boolean;
  'glide-active': boolean;
  'glide-center': boolean;
  'glide-cloned': boolean;
  'glide-current': boolean;
  [key: string]: boolean;
}

/**
 * Get CSS classes for a slide
 */
export const getSlideClasses = (spec: {
  index: number;
  currentSlide: number;
  slideCount: number;
  slidesToShow: number;
  centerMode: boolean;
  targetSlide: number;
  rtl: boolean;
}): SlideClasses => {
  let index = spec.index;
  
  if (spec.rtl) {
    index = spec.slideCount - 1 - spec.index;
  }
  
  const glideCloned = index < 0 || index >= spec.slideCount;
  let glideActive = false;
  let glideCenter = false;
  
  if (spec.centerMode) {
    const centerOffset = Math.floor(spec.slidesToShow / 2);
    glideCenter = (index - spec.currentSlide) % spec.slideCount === 0;
    
    if (
      index > spec.currentSlide - centerOffset - 1 &&
      index <= spec.currentSlide + centerOffset
    ) {
      glideActive = true;
    }
  } else {
    glideActive = spec.currentSlide <= index && index < spec.currentSlide + spec.slidesToShow;
  }
  
  let focusedSlide = spec.targetSlide;
  if (spec.targetSlide < 0) {
    focusedSlide = spec.targetSlide + spec.slideCount;
  } else if (spec.targetSlide >= spec.slideCount) {
    focusedSlide = spec.targetSlide - spec.slideCount;
  }
  
  const glideCurrent = index === focusedSlide;
  
  return {
    'glide-slide': true,
    'glide-active': glideActive,
    'glide-center': glideCenter,
    'glide-cloned': glideCloned,
    'glide-current': glideCurrent,
  };
};
