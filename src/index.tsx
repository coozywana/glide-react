import React, {
  forwardRef,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  Children,
  CSSProperties,
  useMemo,
} from 'react';
import {
  GlideProps,
  GlideState,
  GlideAction,
  GlideRef,
  GlideSettings,
  defaultSettings,
  TouchObject,
} from './types';
import { Track } from './components/Track';
import { PrevArrow, NextArrow } from './components/Arrows';
import { Dots } from './components/Dots';
import { useTrack } from './hooks/useTrack';
import {
  canUseDOM,
  getWidth,
  getHeight,
  swipeStart,
  swipeMove,
  swipeEnd,
  keyHandler,
  getOnDemandLazySlides,
  clamp,
} from './utils/slideUtils';

// ============================================================================
// Initial State
// ============================================================================

const createInitialState = (props: GlideProps): GlideState => ({
  animating: false,
  autoplaying: props.autoplay ? 'playing' : null,
  currentDirection: 0,
  currentLeft: null,
  currentSlide: props.initialSlide || 0,
  direction: 1,
  dragging: false,
  edgeDragged: false,
  initialized: false,
  lazyLoadedList: props.lazyLoad ? [props.initialSlide || 0] : [],
  listHeight: null,
  listWidth: null,
  scrolling: false,
  slideCount: 0,
  slideHeight: null,
  slideWidth: null,
  swipeLeft: null,
  swiped: false,
  swiping: false,
  touchObject: { startX: 0, startY: 0, curX: 0, curY: 0 },
  trackStyle: {},
  trackWidth: 0,
  targetSlide: props.initialSlide || 0,
});

// ============================================================================
// Reducer
// ============================================================================

const glideReducer = (state: GlideState, action: GlideAction): GlideState => {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...action.payload, initialized: true };
    
    case 'SET_DIMENSIONS':
      return { ...state, ...action.payload };
    
    case 'GO_TO_SLIDE':
      return {
        ...state,
        currentSlide: action.payload.slide,
        targetSlide: action.payload.slide,
        animating: action.payload.animated !== false,
      };
    
    case 'NEXT':
    case 'PREV':
      return state; // Handled externally
    
    case 'SET_TRACK_STYLE':
      return { ...state, trackStyle: action.payload };
    
    case 'SWIPE_START':
      return {
        ...state,
        dragging: true,
        touchObject: action.payload,
      };
    
    case 'SWIPE_MOVE':
      return {
        ...state,
        touchObject: action.payload.touchObject,
        swipeLeft: action.payload.swipeLeft,
        trackStyle: action.payload.trackStyle,
        swiping: action.payload.swiping ?? state.swiping,
      };
    
    case 'SWIPE_END':
      return { ...state, ...action.payload };
    
    case 'ANIMATION_END':
      return { ...state, animating: false };
    
    case 'SET_AUTOPLAY':
      return { ...state, autoplaying: action.payload };
    
    case 'UPDATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
};

// ============================================================================
// Main Glide Component
// ============================================================================

export const Glide = forwardRef<GlideRef, GlideProps>(function Glide(props, ref) {
  // ============================================================================
  // Merge Props with Defaults
  // ============================================================================

  const settings: GlideSettings & GlideProps = {
    ...defaultSettings,
    ...props,
  };

  const {
    accessibility,
    adaptiveHeight,
    arrows,
    autoplay,
    autoplaySpeed,
    centerMode,
    centerPadding,
    className,
    cssEase,
    dots,
    dotsClass,
    draggable,
    fade,
    focusOnSelect,
    infinite,
    initialSlide,
    lazyLoad,
    pauseOnDotsHover,
    pauseOnFocus,
    pauseOnHover,
    rtl,
    slidesToScroll,
    slidesToShow,
    speed,
    swipe,
    swipeToSlide,
    touchMove,
    touchThreshold,
    useCSS,
    useTransform,
    variableWidth,
    vertical,
    verticalSwiping,
    waitForAnimate,
    disabled,
    children,
    afterChange,
    beforeChange,
    appendDots,
    customPaging,
    nextArrow,
    prevArrow,
    onEdge,
    onInit,
    onReInit,
    onSwipe,
    swipeEvent,
  } = settings;

  // ============================================================================
  // Refs
  // ============================================================================

  const listRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // ============================================================================
  // State
  // ============================================================================

  const [state, dispatch] = useReducer(glideReducer, props, createInitialState);

  const {
    initialized,
    currentSlide,
    targetSlide,
    animating,
    dragging,
    swiping,
    swipeLeft,
    touchObject,
    listWidth,
    listHeight,
    slideWidth,
    slideHeight,
    lazyLoadedList,
    autoplaying,
    edgeDragged,
    swiped,
    scrolling,
  } = state;

  // ============================================================================
  // Slide Count
  // ============================================================================

  const slideCount = Children.count(children);

  // ============================================================================
  // Responsive Breakpoint Handling
  // ============================================================================

  const [breakpoint, setBreakpoint] = React.useState<number | null>(null);

  useEffect(() => {
    if (!canUseDOM() || !settings.responsive) return;

    const responsiveSettings = settings.responsive;
    const breakpoints = responsiveSettings.map(bp => bp.breakpoint).sort((a, b) => a - b);
    const mediaQueryListeners: Array<{ mql: MediaQueryList; listener: (e: MediaQueryListEvent) => void }> = [];

    // Create media queries for each breakpoint
    breakpoints.forEach((bp, index) => {
      let query: string;
      
      if (index === 0) {
        // First breakpoint: from 0 to breakpoint
        query = `(max-width: ${bp}px)`;
      } else {
        // Subsequent breakpoints: from previous+1 to current
        query = `(min-width: ${breakpoints[index - 1] + 1}px) and (max-width: ${bp}px)`;
      }

      const mql = window.matchMedia(query);
      const listener = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setBreakpoint(bp);
        }
      };

      mql.addEventListener('change', listener);
      mediaQueryListeners.push({ mql, listener });

      // Check initial state
      if (mql.matches) {
        setBreakpoint(bp);
      }
    });

    // Create media query for full screen (above largest breakpoint)
    const maxBreakpoint = breakpoints[breakpoints.length - 1];
    const fullScreenQuery = `(min-width: ${maxBreakpoint + 1}px)`;
    const fullScreenMql = window.matchMedia(fullScreenQuery);
    const fullScreenListener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setBreakpoint(null);
      }
    };

    fullScreenMql.addEventListener('change', fullScreenListener);
    mediaQueryListeners.push({ mql: fullScreenMql, listener: fullScreenListener });

    // Check initial state for full screen
    if (fullScreenMql.matches) {
      setBreakpoint(null);
    }

    return () => {
      mediaQueryListeners.forEach(({ mql, listener }) => {
        mql.removeEventListener('change', listener);
      });
    };
  }, [settings.responsive]);

  // Merge responsive settings with base settings
  const responsiveSettings = useMemo(() => {
    let merged;
    
    if (!breakpoint || !settings.responsive) {
      merged = settings;
    } else {
      const matchedBreakpoint = settings.responsive.find(bp => bp.breakpoint === breakpoint);
      if (!matchedBreakpoint) {
        merged = settings;
      } else if (matchedBreakpoint.settings === 'disabled') {
        merged = { ...settings, slidesToShow: 1, slidesToScroll: 1 };
      } else {
        merged = { ...settings, ...matchedBreakpoint.settings };
      }
    }

    // Force slidesToScroll = 1 if centerMode is on
    if (merged.centerMode && merged.slidesToScroll > 1) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToScroll should be equal to 1 in centerMode, you are using ${merged.slidesToScroll}`
        );
      }
      merged = { ...merged, slidesToScroll: 1 };
    }

    // Force slidesToShow = 1 and slidesToScroll = 1 if fade mode is on
    if (merged.fade) {
      if (merged.slidesToShow > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToShow should be equal to 1 when fade is true, you're using ${merged.slidesToShow}`
        );
      }
      if (merged.slidesToScroll > 1 && process.env.NODE_ENV !== 'production') {
        console.warn(
          `slidesToScroll should be equal to 1 when fade is true, you're using ${merged.slidesToScroll}`
        );
      }
      merged = { ...merged, slidesToShow: 1, slidesToScroll: 1 };
    }

    return merged;
  }, [breakpoint, settings]);

  // Use responsive settings instead of base settings
  const {
    slidesToShow: responsiveSlidesToShow,
    slidesToScroll: responsiveSlidesToScroll,
    infinite: responsiveInfinite,
    centerMode: responsiveCenterMode,
    dots: responsiveDots,
    arrows: responsiveArrows,
  } = responsiveSettings;

  // ============================================================================
  // Track Hook
  // ============================================================================

  const {
    slideWidth: calculatedSlideWidth,
    trackStyle,
    preCloneCount,
    postCloneCount,
    totalSlides,
    getTrackStyleForSlide,
    trackWidth,
  } = useTrack({
    currentSlide,
    slideCount,
    slidesToShow: responsiveSlidesToShow,
    slidesToScroll: responsiveSlidesToScroll,
    infinite: responsiveInfinite,
    centerMode: responsiveCenterMode,
    centerPadding,
    listWidth: listWidth || 0,
    listHeight: listHeight || 0,
    slideWidth: slideWidth ?? undefined,
    slideHeight: slideHeight || 0,
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
  });

  // ============================================================================
  // Client-Side Initialization
  // ============================================================================

  useEffect(() => {
    if (!canUseDOM()) return;

    // Use a small delay to ensure refs are attached
    const timeoutId = setTimeout(() => {
      if (!listRef.current) return;

      const updateDimensions = () => {
        if (!listRef.current) return;

        const newListWidth = getWidth(listRef.current);
        const firstSlide = listRef.current.querySelector('[data-index="0"]') as HTMLElement;
        const newSlideHeight = firstSlide ? getHeight(firstSlide) : null;
        // Calculate listHeight as slideHeight * slidesToShow
        const newListHeight = newSlideHeight ? newSlideHeight * responsiveSlidesToShow : null;

        dispatch({
          type: 'INIT',
          payload: {
            listWidth: newListWidth,
            listHeight: newListHeight,
            slideHeight: newSlideHeight,
            slideCount,
          },
        });
      };

      // Initial measurement
      updateDimensions();

      // Setup resize observer
      if (!resizeObserverRef.current && listRef.current) {
        resizeObserverRef.current = new ResizeObserver(updateDimensions);
        resizeObserverRef.current.observe(listRef.current);
      }

      // Call onInit callback
      if (!initialized) {
        onInit?.();
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [slideCount, initialized, onInit, responsiveSlidesToShow]);

  // ============================================================================
  // Handle Responsive Settings Changes
  // ============================================================================

  // Adjust currentSlide if it's out of bounds when responsive settings change
  useEffect(() => {
    if (!initialized || !canUseDOM()) return;

    // If currentSlide is beyond the valid range, adjust it
    if (currentSlide >= slideCount) {
      const newSlide = Math.max(0, slideCount - responsiveSlidesToShow);
      if (newSlide !== currentSlide) {
        dispatch({
          type: 'GO_TO_SLIDE',
          payload: { slide: newSlide, animated: false },
        });
      }
    }

    // Trigger onReInit callback when responsive settings change
    onReInit?.();
  }, [responsiveSlidesToShow, responsiveSlidesToScroll, responsiveInfinite, responsiveCenterMode, initialized, slideCount, currentSlide, onReInit]);

  // ============================================================================
  // Animation End Handler
  // ============================================================================

  useEffect(() => {
    if (animating) {
      animationEndTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'ANIMATION_END' });
        afterChange?.(currentSlide);
      }, speed);
    }

    return () => {
      if (animationEndTimeoutRef.current) {
        clearTimeout(animationEndTimeoutRef.current);
      }
    };
  }, [animating, speed, afterChange, currentSlide]);

  // ============================================================================
  // Navigation Functions
  // ============================================================================

  const goToSlide = useCallback(
    (slideIndex: number, dontAnimate: boolean = false) => {
      if (waitForAnimate && animating) return;

      let targetIndex = slideIndex;

      // Handle infinite mode wrapping
      if (responsiveInfinite) {
        if (targetIndex < 0) {
          targetIndex = slideCount + targetIndex;
        } else if (targetIndex >= slideCount) {
          targetIndex = targetIndex - slideCount;
        }
      } else {
        // Clamp to valid range
        targetIndex = clamp(targetIndex, 0, slideCount - responsiveSlidesToShow);
      }

      // Call beforeChange callback
      beforeChange?.(currentSlide, targetIndex);

      // Update lazy loaded list
      if (lazyLoad) {
        const slidesToLoad = getOnDemandLazySlides({
          currentSlide: targetIndex,
          centerMode: responsiveCenterMode,
          slidesToShow: responsiveSlidesToShow,
          centerPadding,
          lazyLoadedList,
        });
        
        if (slidesToLoad.length > 0) {
          dispatch({
            type: 'UPDATE',
            payload: { lazyLoadedList: [...lazyLoadedList, ...slidesToLoad] },
          });
        }
      }

      dispatch({
        type: 'GO_TO_SLIDE',
        payload: { slide: targetIndex, animated: !dontAnimate },
      });
    },
    [
      waitForAnimate,
      animating,
      responsiveInfinite,
      slideCount,
      responsiveSlidesToShow,
      beforeChange,
      currentSlide,
      lazyLoad,
      responsiveCenterMode,
      centerPadding,
      lazyLoadedList,
    ]
  );

  const next = useCallback(() => {
    goToSlide(currentSlide + responsiveSlidesToScroll);
  }, [currentSlide, responsiveSlidesToScroll, goToSlide]);

  const prev = useCallback(() => {
    goToSlide(currentSlide - responsiveSlidesToScroll);
  }, [currentSlide, responsiveSlidesToScroll, goToSlide]);

  const goTo = useCallback(
    (index: number, dontAnimate: boolean = false) => {
      goToSlide(index, dontAnimate);
    },
    [goToSlide]
  );

  const pause = useCallback(() => {
    dispatch({ type: 'SET_AUTOPLAY', payload: 'paused' });
  }, []);

  const play = useCallback(() => {
    dispatch({ type: 'SET_AUTOPLAY', payload: 'playing' });
  }, []);

  // ============================================================================
  // Autoplay Timer
  // ============================================================================

  const autoplayTick = useCallback(() => {
    const nextSlideIndex = currentSlide + responsiveSlidesToScroll;
    goToSlide(nextSlideIndex);
  }, [currentSlide, responsiveSlidesToScroll, goToSlide]);

  useEffect(() => {
    if (!autoplay || !initialized) return;

    if (autoplaying === 'playing') {
      // Clear any existing interval
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
      // Use setInterval with buffer to match expected timing
      autoplayTimerRef.current = setInterval(autoplayTick, autoplaySpeed + 50) as any;
    } else {
      // Clear interval when not playing
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [autoplay, autoplaying, initialized, autoplayTick, autoplaySpeed]);

  // ============================================================================
  // Imperative Handle (ref API)
  // ============================================================================

  useImperativeHandle(
    ref,
    () => ({
      prev,
      next,
      goTo,
      pause,
      play,
      innerSlider: { state: { currentSlide } },
    }),
    [prev, next, goTo, pause, play, currentSlide]
  );

  // ============================================================================
  // Event Handlers
  // ============================================================================

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const action = keyHandler(e, accessibility, rtl);
      if (action === 'next') {
        next();
      } else if (action === 'previous') {
        prev();
      }
    },
    [accessibility, rtl, next, prev]
  );

  // ============================================================================
  // Swipe/Touch Handlers
  // ============================================================================

  const handleSwipeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const result = swipeStart(e, swipe, draggable);
      if (result) {
        dispatch({ type: 'SWIPE_START', payload: result.touchObject });
      }
    },
    [swipe, draggable]
  );

  const handleSwipeMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging) return;

      const result = swipeMove(e, {
        scrolling,
        animating,
        vertical,
        swipeToSlide,
        verticalSwiping,
        rtl,
        currentSlide,
        edgeFriction: settings.edgeFriction,
        edgeDragged,
        onEdge,
        swiped,
        swiping,
        slideCount,
        slidesToScroll: responsiveSlidesToScroll,
        infinite: responsiveInfinite,
        touchObject,
        swipeEvent,
        listHeight: listHeight || 0,
        listWidth: listWidth || 0,
        slideWidth: calculatedSlideWidth,
        slideHeight: slideHeight || 0,
        centerMode: responsiveCenterMode,
        slidesToShow: responsiveSlidesToShow,
        fade,
        disabled,
        variableWidth,
        useTransform,
      });

      if (result && 'scrolling' in result && result.scrolling) {
        dispatch({ type: 'UPDATE', payload: { scrolling: true } });
      } else if (result && 'swipeLeft' in result) {
        dispatch({ type: 'SWIPE_MOVE', payload: result as any });
      }
    },
    [
      dragging,
      scrolling,
      animating,
      vertical,
      swipeToSlide,
      verticalSwiping,
      rtl,
      currentSlide,
      settings.edgeFriction,
      edgeDragged,
      onEdge,
      swiped,
      swiping,
      slideCount,
      responsiveSlidesToScroll,
      responsiveInfinite,
      touchObject,
      swipeEvent,
      listHeight,
      listWidth,
      calculatedSlideWidth,
      slideHeight,
      responsiveCenterMode,
      responsiveSlidesToShow,
      fade,
      disabled,
      variableWidth,
      useTransform,
    ]
  );

  const handleSwipeEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const result = swipeEnd(e, {
        dragging,
        swipe,
        touchObject,
        listWidth: listWidth || 0,
        touchThreshold,
        verticalSwiping,
        listHeight: listHeight || 0,
        swipeToSlide,
        scrolling,
        onSwipe,
        targetSlide,
        currentSlide,
        infinite: responsiveInfinite,
        slideCount,
        slidesToScroll: responsiveSlidesToScroll,
        slidesToShow: responsiveSlidesToShow,
        slideWidth: calculatedSlideWidth,
        slideHeight: slideHeight || 0,
        centerMode: responsiveCenterMode,
        fade,
        disabled,
        variableWidth,
        useTransform,
        speed,
        cssEase,
        rtl,
        vertical,
      });

      dispatch({
        type: 'SWIPE_END',
        payload: {
          dragging: result.dragging,
          edgeDragged: result.edgeDragged,
          scrolling: result.scrolling,
          swiping: result.swiping,
          swiped: result.swiped,
          swipeLeft: result.swipeLeft,
          touchObject: result.touchObject,
        },
      });

      // Trigger slide change if needed
      if (result.triggerSlideHandler !== undefined) {
        goToSlide(result.triggerSlideHandler);
      } else if (result.trackStyle) {
        dispatch({ type: 'SET_TRACK_STYLE', payload: result.trackStyle });
      }
    },
    [
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
      targetSlide,
      currentSlide,
      responsiveInfinite,
      slideCount,
      responsiveSlidesToScroll,
      responsiveSlidesToShow,
      calculatedSlideWidth,
      slideHeight,
      responsiveCenterMode,
      fade,
      disabled,
      variableWidth,
      useTransform,
      speed,
      cssEase,
      rtl,
      vertical,
      goToSlide,
    ]
  );

  // ============================================================================
  // Pause on Hover/Focus Handlers
  // ============================================================================

  const handleMouseEnter = useCallback(() => {
    if (autoplay && pauseOnHover) {
      dispatch({ type: 'SET_AUTOPLAY', payload: 'hovered' });
    }
  }, [autoplay, pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (autoplay && pauseOnHover && autoplaying === 'hovered') {
      dispatch({ type: 'SET_AUTOPLAY', payload: 'playing' });
    }
  }, [autoplay, pauseOnHover, autoplaying]);

  const handleFocus = useCallback(() => {
    if (autoplay && pauseOnFocus) {
      dispatch({ type: 'SET_AUTOPLAY', payload: 'focused' });
    }
  }, [autoplay, pauseOnFocus]);

  const handleBlur = useCallback(() => {
    if (autoplay && pauseOnFocus && autoplaying === 'focused') {
      dispatch({ type: 'SET_AUTOPLAY', payload: 'playing' });
    }
  }, [autoplay, pauseOnFocus, autoplaying]);

  // ============================================================================
  // Dot Handlers
  // ============================================================================

  const handleDotClick = useCallback(
    (index: number) => {
      goToSlide(index);
    },
    [goToSlide]
  );

  const handleDotMouseEnter = useCallback(() => {
    if (autoplay && pauseOnDotsHover) {
      dispatch({ type: 'SET_AUTOPLAY', payload: 'hovered' });
    }
  }, [autoplay, pauseOnDotsHover]);

  const handleDotMouseLeave = useCallback(() => {
    if (autoplay && pauseOnDotsHover && autoplaying === 'hovered') {
      dispatch({ type: 'SET_AUTOPLAY', payload: 'playing' });
    }
  }, [autoplay, pauseOnDotsHover, autoplaying]);

  // ============================================================================
  // Slide Click Handler (for focusOnSelect)
  // ============================================================================

  const handleSlideClick = useCallback(
    (index: number) => {
      if (focusOnSelect) {
        goToSlide(index);
      }
    },
    [focusOnSelect, goToSlide]
  );

  // ============================================================================
  // Styles
  // ============================================================================

  const sliderStyle: CSSProperties = useMemo(
    () => ({
      position: 'relative',
      display: 'block',
      boxSizing: 'border-box',
      userSelect: 'none',
      touchAction: vertical ? 'pan-x' : 'pan-y',
      WebkitTapHighlightColor: 'transparent',
    }),
    [vertical]
  );

  const listStyle: CSSProperties = useMemo(() => {
    const style: CSSProperties = {
      position: 'relative',
      display: 'block',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    };

    // Apply height for vertical mode
    if (vertical && listHeight) {
      style.height = listHeight;
    }

    // Apply centerPadding to list
    if (responsiveCenterMode) {
      if (vertical) {
        style.padding = `${centerPadding} 0px`;
      } else {
        style.padding = `0px ${centerPadding}`;
      }
    }

    return style;
  }, [responsiveCenterMode, vertical, centerPadding, listHeight]);

  // ============================================================================
  // SSR / Hydration Safe Render
  // ============================================================================

  // If not initialized (SSR or before mount), render a safe fallback
  if (!initialized || !canUseDOM()) {
    return (
      <div className={`glide-slider ${className}`.trim()} style={sliderStyle}>
        <div ref={listRef} className="glide-list" style={listStyle}>
          <div className="glide-track" style={{ display: 'flex' }}>
            {React.Children.map(children, (child, idx) => (
              <div
                key={idx}
                className="glide-slide"
                style={{
                  width: `${100 / responsiveSlidesToShow}%`,
                  flexShrink: 0,
                }}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div
      className={`glide-slider ${className} ${vertical ? 'glide-vertical' : ''}`.trim()}
      style={sliderStyle}
      onKeyDown={handleKeyDown}
      tabIndex={accessibility ? 0 : undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* Previous Arrow */}
      {responsiveArrows && !disabled && (
        <PrevArrow
          currentSlide={currentSlide}
          slideCount={slideCount}
          slidesToShow={responsiveSlidesToShow}
          infinite={responsiveInfinite}
          centerMode={responsiveCenterMode}
          vertical={vertical}
          onClick={prev}
          customArrow={prevArrow}
        />
      )}

      {/* Slider List */}
      <div
        ref={listRef}
        className="glide-list"
        style={listStyle}
        onMouseDown={touchMove ? handleSwipeStart : undefined}
        onMouseMove={touchMove && dragging ? handleSwipeMove : undefined}
        onMouseUp={touchMove ? handleSwipeEnd : undefined}
        onMouseLeave={touchMove && dragging ? handleSwipeEnd : handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onTouchStart={swipe ? handleSwipeStart : undefined}
        onTouchMove={swipe && dragging ? handleSwipeMove : undefined}
        onTouchEnd={swipe ? handleSwipeEnd : undefined}
        onTouchCancel={swipe && dragging ? handleSwipeEnd : undefined}
      >
        <Track
          ref={trackRef}
          trackStyle={trackStyle}
          slideWidth={calculatedSlideWidth}
          slideHeight={slideHeight || undefined}
          slideCount={slideCount}
          currentSlide={currentSlide}
          targetSlide={targetSlide}
          slidesToShow={responsiveSlidesToShow}
          slidesToScroll={responsiveSlidesToScroll}
          infinite={responsiveInfinite}
          centerMode={responsiveCenterMode}
          centerPadding={centerPadding}
          fade={fade}
          vertical={vertical}
          variableWidth={variableWidth}
          rtl={rtl}
          disabled={disabled}
          lazyLoad={lazyLoad}
          lazyLoadedList={lazyLoadedList}
          speed={speed}
          cssEase={cssEase}
          useCSS={useCSS}
          focusOnSelect={focusOnSelect}
          onSlideClick={handleSlideClick}
        >
          {children}
        </Track>
      </div>

      {/* Next Arrow */}
      {responsiveArrows && !disabled && (
        <NextArrow
          currentSlide={currentSlide}
          slideCount={slideCount}
          slidesToShow={responsiveSlidesToShow}
          infinite={responsiveInfinite}
          centerMode={responsiveCenterMode}
          vertical={vertical}
          onClick={next}
          customArrow={nextArrow}
        />
      )}

      {/* Dots */}
      {responsiveDots && !disabled && (
        <Dots
          slideCount={slideCount}
          slidesToScroll={responsiveSlidesToScroll}
          slidesToShow={responsiveSlidesToShow}
          currentSlide={currentSlide}
          infinite={responsiveInfinite}
          onDotClick={handleDotClick}
          customPaging={customPaging}
          appendDots={appendDots}
          dotsClass={dotsClass}
          onMouseEnter={handleDotMouseEnter}
          onMouseLeave={handleDotMouseLeave}
        />
      )}
    </div>
  );
});

// ============================================================================
// Exports
// ============================================================================

export default Glide;

// Re-export types
export type {
  GlideProps,
  GlideRef,
  GlideSettings,
  GlideState,
  ResponsiveSettings,
} from './types';

// Re-export utilities for advanced usage
export { useTrack } from './hooks/useTrack';
export { Track } from './components/Track';
export { PrevArrow, NextArrow } from './components/Arrows';
export { Dots } from './components/Dots';
export * from './utils/slideUtils';
