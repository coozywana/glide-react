
# glide-react

[![npm version](https://img.shields.io/npm/v/glide-react?style=flat-square)](https://www.npmjs.com/package/glide-react)
[![npm downloads](https://img.shields.io/npm/dm/glide-react?style=flat-square)](https://www.npmjs.com/package/glide-react)

Official npm package: [glide-react](https://www.npmjs.com/package/glide-react)

A modern, minimalistic, lightweight React carousel component built with TypeScript, hooks, and functional components.

## Features

- 🎯 **TypeScript First** - Full type safety with strict interfaces
- ⚡ **Modern React** - Built with hooks and functional components
- 🔄 **Infinite Scrolling** - Seamless looping with clone-based approach
- 📱 **Touch/Swipe Support** - Native touch gestures for mobile
- 🎨 **CSS-in-JS Ready** - Inline styles for critical layout, customizable via className
- 🖥️ **SSR/Next.js Compatible** - Hydration-safe with fallback rendering
- 🪶 **Lightweight** - No external dependencies beyond React
- 📦 **Small Bundle** - ~50KB ESM bundle

## Installation

```bash
npm install glide-react
# or
yarn add glide-react
# or
pnpm add glide-react
```

## Quick Start

```tsx
import Glide from 'glide-react';

function MyCarousel() {
  return (
    <Glide
      slidesToShow={3}
      slidesToScroll={1}
      infinite={true}
      dots={true}
      arrows={true}
    >
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
      <div>Slide 4</div>
      <div>Slide 5</div>
    </Glide>
  );
}
```

## Props

### Core Settings

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slidesToShow` | `number` | `1` | Number of slides visible at once |
| `slidesToScroll` | `number` | `1` | Number of slides to scroll per navigation |
| `infinite` | `boolean` | `true` | Enable infinite loop scrolling |
| `speed` | `number` | `500` | Transition duration in milliseconds |
| `autoplay` | `boolean` | `false` | Auto-advance slides |
| `autoplaySpeed` | `number` | `3000` | Autoplay interval in milliseconds |
| `dots` | `boolean` | `false` | Show dot indicators |
| `arrows` | `boolean` | `true` | Show prev/next arrows |
| `fade` | `boolean` | `false` | Use fade effect instead of sliding |
| `vertical` | `boolean` | `false` | Vertical slide mode |
| `centerMode` | `boolean` | `false` | Center the active slide |
| `centerPadding` | `string` | `'50px'` | Side padding in center mode |
| `rtl` | `boolean` | `false` | Right-to-left mode |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `beforeChange` | `(current, next) => void` | Called before slide change |
| `afterChange` | `(current) => void` | Called after slide change |
| `onInit` | `() => void` | Called on slider initialization |
| `onSwipe` | `(direction) => void` | Called on swipe end |

### Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS class |
| `dotsClass` | `string` | `'glide-dots'` | Dots container class |
| `prevArrow` | `ReactElement` | `null` | Custom previous arrow |
| `nextArrow` | `ReactElement` | `null` | Custom next arrow |
| `customPaging` | `(i) => ReactElement` | `null` | Custom dot renderer |
| `appendDots` | `(dots) => ReactElement` | `null` | Custom dots container |

## Ref Methods

Access slider methods via ref:

```tsx
import { useRef } from 'react';
import Glide, { GlideRef } from 'glide-react';

function MyCarousel() {
  const sliderRef = useRef<GlideRef>(null);

  return (
    <>
      <button onClick={() => sliderRef.current?.prev()}>
        Previous
      </button>
      <button onClick={() => sliderRef.current?.next()}>
        Next
      </button>
      <button onClick={() => sliderRef.current?.goTo(0)}>
        Go to first
      </button>
      
      <Glide ref={sliderRef}>
        {/* slides */}
      </Glide>
    </>
  );
}
```

### Available Methods

| Method | Description |
|--------|-------------|
| `prev()` | Go to previous slide |
| `next()` | Go to next slide |
| `goTo(index, dontAnimate?)` | Go to specific slide |
| `pause()` | Pause autoplay |
| `play()` | Start autoplay |

## Responsive Settings

```tsx
<Glide
  slidesToShow={4}
  responsive={[
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      }
    }
  ]}
>
  {/* slides */}
</Glide>
```

## Custom Arrows

```tsx
function CustomPrevArrow({ onClick }) {
  return <button onClick={onClick}>←</button>;
}

function CustomNextArrow({ onClick }) {
  return <button onClick={onClick}>→</button>;
}

<Glide
  prevArrow={<CustomPrevArrow />}
  nextArrow={<CustomNextArrow />}
>
  {/* slides */}
</Glide>
```

## Styling

The component uses inline styles for critical layout. You can customize appearance via:

1. **className prop** - Add your own classes
2. **Built-in class names** - Style `.glide-slider`, `.glide-track`, `.glide-slide`, `.glide-arrow`, `.glide-dots`, etc.
3. **Custom components** - Use `prevArrow`, `nextArrow`, `customPaging`, `appendDots`

## License

MIT
