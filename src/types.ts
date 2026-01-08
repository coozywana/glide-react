import { CSSProperties, ReactNode, ReactElement, RefObject } from 'react';

// ============================================================================
// Touch/Swipe Types
// ============================================================================

export interface TouchObject {
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  swipeLength?: number;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | 'vertical';

// ============================================================================
// Responsive Settings
// ============================================================================

export interface ResponsiveSettings {
  breakpoint: number;
  settings: Partial<GlideSettings> | 'disabled';
}

// ============================================================================
// Core Settings (props that affect behavior)
// ============================================================================

export interface GlideSettings {
  /** Enable keyboard navigation */
  accessibility: boolean;
  /** Adjust height to current slide */
  adaptiveHeight: boolean;
  /** Show prev/next arrows */
  arrows: boolean;
  /** Auto-advance slides */
  autoplay: boolean;
  /** Auto-advance interval in ms */
  autoplaySpeed: number;
  /** Center the active slide */
  centerMode: boolean;
  /** Side padding in center mode (e.g., "50px" or "10%") */
  centerPadding: string;
  /** Additional CSS class */
  className: string;
  /** CSS easing function */
  cssEase: string;
  /** Show dot indicators */
  dots: boolean;
  /** Dots container class */
  dotsClass: string;
  /** Enable mouse dragging */
  draggable: boolean;
  /** JS animation easing */
  easing: string;
  /** Resistance at edges (0-1) */
  edgeFriction: number;
  /** Use fade instead of slide */
  fade: boolean;
  /** Click slide to navigate */
  focusOnSelect: boolean;
  /** Infinite loop scrolling */
  infinite: boolean;
  /** Starting slide index */
  initialSlide: number;
  /** Lazy load mode: "ondemand" | "progressive" | null */
  lazyLoad: 'ondemand' | 'progressive' | null;
  /** Pause autoplay on dot hover */
  pauseOnDotsHover: boolean;
  /** Pause autoplay on focus */
  pauseOnFocus: boolean;
  /** Pause autoplay on hover */
  pauseOnHover: boolean;
  /** Responsive breakpoint settings */
  responsive: ResponsiveSettings[] | null;
  /** Grid rows per slide */
  rows: number;
  /** Right-to-left mode */
  rtl: boolean;
  /** Slide element tag */
  slide: string;
  /** Grid columns per row */
  slidesPerRow: number;
  /** Slides per navigation */
  slidesToScroll: number;
  /** Visible slides */
  slidesToShow: number;
  /** Transition duration in ms */
  speed: number;
  /** Enable touch swiping */
  swipe: boolean;
  /** Swipe to any slide position */
  swipeToSlide: boolean;
  /** Enable touch drag */
  touchMove: boolean;
  /** Swipe threshold divisor */
  touchThreshold: number;
  /** Use CSS transitions */
  useCSS: boolean;
  /** Use CSS transforms */
  useTransform: boolean;
  /** Variable slide widths */
  variableWidth: boolean;
  /** Vertical slide mode */
  vertical: boolean;
  /** Enable vertical swiping */
  verticalSwiping: boolean;
  /** Block nav during animation */
  waitForAnimate: boolean;
  /** Disable slider behavior */
  disabled: boolean;
}

// ============================================================================
// Callback Props
// ============================================================================

export interface GlideCallbacks {
  /** Callback after slide change */
  afterChange?: (currentSlide: number) => void;
  /** Callback before slide change */
  beforeChange?: (currentSlide: number, nextSlide: number) => void;
  /** Custom dots container */
  appendDots?: (dots: ReactNode) => ReactElement;
  /** Custom dot renderer */
  customPaging?: (index: number) => ReactElement;
  /** Callback at edge swipe */
  onEdge?: (direction: SwipeDirection) => void;
  /** Callback on init */
  onInit?: () => void;
  /** Lazy load error callback */
  onLazyLoadError?: (index: number) => void;
  /** Callback on re-init */
  onReInit?: () => void;
  /** Swipe direction callback */
  swipeEvent?: (direction: SwipeDirection) => void;
  /** Callback on swipe end */
  onSwipe?: (direction: SwipeDirection) => void;
}

// ============================================================================
// Custom Element Props
// ============================================================================

export interface GlideCustomElements {
  /** Custom next arrow element */
  nextArrow?: ReactElement;
  /** Custom prev arrow element */
  prevArrow?: ReactElement;
}

// ============================================================================
// Full Props (Settings + Callbacks + Custom Elements + Children)
// ============================================================================

export interface GlideProps extends Partial<GlideSettings>, GlideCallbacks, GlideCustomElements {
  /** Slider content (slides) */
  children?: ReactNode;
  /** Sync with another slider */
  asNavFor?: RefObject<GlideRef>;
}

// ============================================================================
// Internal State
// ============================================================================

export interface GlideState {
  /** Currently animating */
  animating: boolean;
  /** Autoplay state: "playing" | "paused" | "hovered" | "focused" | null */
  autoplaying: 'playing' | 'paused' | 'hovered' | 'focused' | null;
  /** Movement direction: 0 = forward, 1 = backward */
  currentDirection: number;
  /** Current transform position */
  currentLeft: number | null;
  /** Active slide index */
  currentSlide: number;
  /** Direction multiplier */
  direction: number;
  /** Mouse/touch drag active */
  dragging: boolean;
  /** Dragged past edge */
  edgeDragged: boolean;
  /** Component initialized */
  initialized: boolean;
  /** Indices of lazy loaded slides */
  lazyLoadedList: number[];
  /** Container height */
  listHeight: number | null;
  /** Container width */
  listWidth: number | null;
  /** Native scroll in progress */
  scrolling: boolean;
  /** Total slide count */
  slideCount: number;
  /** Single slide height */
  slideHeight: number | null;
  /** Single slide width */
  slideWidth: number | null;
  /** Current swipe position */
  swipeLeft: number | null;
  /** Swipe event fired */
  swiped: boolean;
  /** Swipe in progress */
  swiping: boolean;
  /** Touch tracking object */
  touchObject: TouchObject;
  /** Track inline styles */
  trackStyle: CSSProperties;
  /** Track element width */
  trackWidth: number;
  /** Destination slide index */
  targetSlide: number;
}

// ============================================================================
// State Actions
// ============================================================================

export type GlideAction =
  | { type: 'INIT'; payload: Partial<GlideState> }
  | { type: 'SET_DIMENSIONS'; payload: { listWidth: number; listHeight: number; slideWidth: number; slideHeight: number } }
  | { type: 'GO_TO_SLIDE'; payload: { slide: number; animated?: boolean } }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_TRACK_STYLE'; payload: CSSProperties }
  | { type: 'SWIPE_START'; payload: TouchObject }
  | { type: 'SWIPE_MOVE'; payload: { touchObject: TouchObject; swipeLeft: number; trackStyle: CSSProperties; swiping?: boolean } }
  | { type: 'SWIPE_END'; payload: Partial<GlideState> }
  | { type: 'ANIMATION_END' }
  | { type: 'SET_AUTOPLAY'; payload: GlideState['autoplaying'] }
  | { type: 'UPDATE'; payload: Partial<GlideState> };

// ============================================================================
// Ref Handle (exposed methods)
// ============================================================================

export interface GlideRef {
  /** Go to previous slide */
  prev: () => void;
  /** Go to next slide */
  next: () => void;
  /** Go to specific slide index */
  goTo: (index: number, dontAnimate?: boolean) => void;
  /** Pause autoplay */
  pause: () => void;
  /** Start autoplay */
  play: () => void;
  /** Get current slide index */
  innerSlider: { state: { currentSlide: number } } | null;
}

// ============================================================================
// Spec Object (passed to utility functions)
// ============================================================================

export interface SlideSpec extends GlideSettings {
  slideIndex: number;
  currentSlide: number;
  slideCount: number;
  slideWidth: number;
  slideHeight: number;
  listWidth: number;
  listHeight: number;
  trackRef?: HTMLDivElement | null;
  lazyLoadedList: number[];
  targetSlide: number;
}

// ============================================================================
// Default Settings
// ============================================================================

export const defaultSettings: GlideSettings = {
  accessibility: true,
  adaptiveHeight: false,
  arrows: true,
  autoplay: false,
  autoplaySpeed: 3000,
  centerMode: false,
  centerPadding: '50px',
  className: '',
  cssEase: 'ease',
  dots: false,
  dotsClass: 'glide-dots',
  draggable: true,
  easing: 'linear',
  edgeFriction: 0.35,
  fade: false,
  focusOnSelect: false,
  infinite: true,
  initialSlide: 0,
  lazyLoad: null,
  pauseOnDotsHover: false,
  pauseOnFocus: false,
  pauseOnHover: true,
  responsive: null,
  rows: 1,
  rtl: false,
  slide: 'div',
  slidesPerRow: 1,
  slidesToScroll: 1,
  slidesToShow: 1,
  speed: 500,
  swipe: true,
  swipeToSlide: false,
  touchMove: true,
  touchThreshold: 5,
  useCSS: true,
  useTransform: true,
  variableWidth: false,
  vertical: false,
  verticalSwiping: false,
  waitForAnimate: true,
  disabled: false,
};
