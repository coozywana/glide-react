## Common Patterns & Best Practices

### Installation

```bash
npm install glide-react
# or
yarn add glide-react
# or
pnpm add glide-react
```

### Basic Usage

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

### Responsive Breakpoints

Use the `responsive` prop to define different settings at different screen sizes:

```tsx
<Glide
  slidesToShow={4}
  slidesToScroll={4}
  responsive={[
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]}
>
  {/* slides */}
</Glide>
```

### Controlling the Slider with Ref

Access slider methods using a ref:

```tsx
import { useRef } from 'react';
import Glide, { GlideRef } from 'glide-react';

function MyCarousel() {
  const sliderRef = useRef<GlideRef>(null);

  const handlePrevious = () => {
    sliderRef.current?.prev();
  };

  const handleNext = () => {
    sliderRef.current?.next();
  };

  const handleGoToFirst = () => {
    sliderRef.current?.goTo(0);
  };

  return (
    <>
      <div className="button-group">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
        <button onClick={handleGoToFirst}>Go to First</button>
      </div>
      
      <Glide ref={sliderRef}>
        {/* slides */}
      </Glide>
    </>
  );
}
```

### Dynamic Slides

You can dynamically add or remove slides by managing the children in your component state:

```tsx
import { useState } from 'react';
import Glide from 'glide-react';

function DynamicCarousel() {
  const [slides, setSlides] = useState([1, 2, 3, 4, 5]);

  const addSlide = () => {
    setSlides([...slides, slides.length + 1]);
  };

  const removeSlide = () => {
    if (slides.length > 1) {
      setSlides(slides.slice(0, -1));
    }
  };

  return (
    <>
      <div className="button-group">
        <button onClick={addSlide}>Add Slide</button>
        <button onClick={removeSlide}>Remove Slide</button>
      </div>
      
      <Glide slidesToShow={3}>
        {slides.map((slide) => (
          <div key={slide}>
            <h3>{slide}</h3>
          </div>
        ))}
      </Glide>
    </>
  );
}
```

### Custom Arrows

Create custom arrow components for complete control over styling:

```tsx
function CustomPrevArrow({ onClick, className }) {
  return (
    <button 
      className={className}
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        fontSize: '20px',
        color: 'white',
        cursor: 'pointer',
      }}
    >
      ←
    </button>
  );
}

function CustomNextArrow({ onClick, className }) {
  return (
    <button 
      className={className}
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        fontSize: '20px',
        color: 'white',
        cursor: 'pointer',
      }}
    >
      →
    </button>
  );
}

<Glide
  prevArrow={<CustomPrevArrow />}
  nextArrow={<CustomNextArrow />}
>
  {/* slides */}
</Glide>
```

### Callbacks

Use callbacks to track slide changes and other events:

```tsx
import { useState } from 'react';
import Glide from 'glide-react';

function CarouselWithCallbacks() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <p>Current Slide: {currentSlide + 1}</p>
      
      <Glide
        slidesToShow={1}
        beforeChange={(current, next) => {
          console.log(`Changing from slide ${current} to ${next}`);
        }}
        afterChange={(current) => {
          setCurrentSlide(current);
          console.log(`Now on slide ${current}`);
        }}
        onInit={() => {
          console.log('Slider initialized');
        }}
        onSwipe={(direction) => {
          console.log(`Swiped ${direction}`);
        }}
      >
        {/* slides */}
      </Glide>
    </>
  );
}
```

### Center Mode

Display the current slide in the center with partial views of adjacent slides:

```tsx
<Glide
  centerMode={true}
  centerPadding="60px"
  slidesToShow={3}
  className="center"
>
  {/* slides */}
</Glide>
```

### Autoplay

Enable automatic slide progression:

```tsx
<Glide
  autoplay={true}
  autoplaySpeed={3000}
  pauseOnHover={true}
  infinite={true}
>
  {/* slides */}
</Glide>
```

### Fade Effect

Use fade transitions instead of sliding:

```tsx
<Glide
  fade={true}
  slidesToShow={1}
  speed={500}
>
  {/* slides */}
</Glide>
```

### Vertical Mode

Display slides vertically:

```tsx
<Glide
  vertical={true}
  slidesToShow={3}
  slidesToScroll={1}
>
  {/* slides */}
</Glide>
```

### Styling

Glide React uses inline styles for critical layout but provides class names for customization:

#### Available Class Names

- `.glide-slider` - Main container
- `.glide-list` - List wrapper
- `.glide-track` - Slides track
- `.glide-slide` - Individual slide
- `.glide-slide.glide-active` - Active slide
- `.glide-slide.glide-center` - Center slide (in center mode)
- `.glide-arrow` - Arrow buttons
- `.glide-arrow.glide-prev` - Previous arrow
- `.glide-arrow.glide-next` - Next arrow
- `.glide-arrow.glide-disabled` - Disabled arrow
- `.glide-dots` - Dots container
- `.glide-dots li` - Dot item
- `.glide-dots li.glide-active` - Active dot

#### Custom Styling Example

```css
/* Custom arrow styles */
.my-slider .glide-arrow {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 60px;
  height: 60px;
  border-radius: 8px;
}

/* Custom dot styles */
.my-slider .glide-dots li button {
  width: 16px;
  height: 16px;
  background-color: #e0e0e0;
}

.my-slider .glide-dots li.glide-active button {
  background-color: #667eea;
}

/* Custom slide styles */
.my-slider .glide-slide {
  padding: 10px;
}
```

### SSR / Next.js Support

Glide React is fully compatible with Server-Side Rendering:

```tsx
// pages/index.tsx (Next.js)
import dynamic from 'next/dynamic';

const Glide = dynamic(() => import('glide-react'), {
  ssr: true, // Glide React supports SSR
});

export default function HomePage() {
  return (
    <Glide slidesToShow={3}>
      {/* slides */}
    </Glide>
  );
}
```

### Flexbox Support

If you have flex property on a container div of the slider, add the following CSS to prevent layout issues:

```css
* {
  min-height: 0;
  min-width: 0;
}
```

### TypeScript

Glide React is written in TypeScript and provides complete type definitions:

```typescript
import Glide, { GlideRef, GlideProps } from 'glide-react';
import { useRef } from 'react';

// Type-safe props
const settings: Partial<GlideProps> = {
  slidesToShow: 3,
  infinite: true,
  autoplay: true,
};

// Type-safe ref
const sliderRef = useRef<GlideRef>(null);

function MyComponent() {
  return <Glide ref={sliderRef} {...settings}>
    {/* slides */}
  </Glide>;
}
```

### Performance Tips

1. **Lazy Loading**: Enable lazy loading for image-heavy carousels:
   ```tsx
   <Glide lazyLoad="ondemand">
     <div><img data-lazy="image1.jpg" /></div>
     <div><img data-lazy="image2.jpg" /></div>
   </Glide>
   ```

2. **Optimize Re-renders**: Memoize slide content when using dynamic data:
   ```tsx
   const slides = useMemo(() => 
     data.map(item => <Slide key={item.id} data={item} />),
     [data]
   );
   ```

3. **Reduce Animation Speed**: Use shorter `speed` values for snappier transitions:
   ```tsx
   <Glide speed={300}>{/* slides */}</Glide>
   ```

### Accessibility

Glide React includes built-in accessibility features:

- Keyboard navigation (arrow keys)
- ARIA labels and roles
- Focus management
- Screen reader support

To disable accessibility features:

```tsx
<Glide accessibility={false}>
  {/* slides */}
</Glide>
```
