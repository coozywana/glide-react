## API Reference

### Props

#### Core Settings

| Prop              | Type      | Default | Description                                          |
| ----------------- | --------- | ------- | ---------------------------------------------------- |
| `slidesToShow`    | number    | `1`     | Number of slides visible at once                     |
| `slidesToScroll`  | number    | `1`     | Number of slides to scroll per navigation            |
| `infinite`        | boolean   | `true`  | Enable infinite loop scrolling                       |
| `speed`           | number    | `500`   | Transition duration in milliseconds                  |
| `autoplay`        | boolean   | `false` | Auto-advance slides                                  |
| `autoplaySpeed`   | number    | `3000`  | Autoplay interval in milliseconds                    |
| `pauseOnHover`    | boolean   | `true`  | Pause autoplay on hover                              |
| `dots`            | boolean   | `false` | Show dot indicators                                  |
| `arrows`          | boolean   | `true`  | Show prev/next arrows                                |
| `fade`            | boolean   | `false` | Use fade effect instead of sliding                   |
| `vertical`        | boolean   | `false` | Vertical slide mode                                  |
| `centerMode`      | boolean   | `false` | Center the active slide                              |
| `centerPadding`   | string    | `'50px'`| Side padding in center mode                          |
| `rtl`             | boolean   | `false` | Right-to-left mode                                   |
| `draggable`       | boolean   | `true`  | Enable mouse dragging                                |
| `swipe`           | boolean   | `true`  | Enable touch swipe                                   |
| `swipeToSlide`    | boolean   | `false` | Allow swiping to any slide                           |
| `touchThreshold`  | number    | `5`     | Swipe distance threshold                             |
| `accessibility`   | boolean   | `true`  | Enable keyboard navigation                           |
| `adaptiveHeight`  | boolean   | `false` | Adjust slider height based on visible slides         |
| `variableWidth`   | boolean   | `false` | Allow slides to have variable width                  |
| `lazyLoad`        | string    | `null`  | Lazy load images ('ondemand', 'progressive', or null)|
| `initialSlide`    | number    | `0`     | Index of initial slide                               |

#### Responsive Settings

| Prop         | Type  | Default | Description                                          |
| ------------ | ----- | ------- | ---------------------------------------------------- |
| `responsive` | array | `[]`    | Array of breakpoint settings (see below)             |

##### Responsive Property Format

Array of objects in the form of `{ breakpoint: int, settings: { ... } }`. The breakpoint _int_ is the `maxWidth` so the settings will be applied when resolution is below this value. Breakpoints in the array should be ordered from smallest to greatest.

Example:
```javascript
responsive: [
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
]
```

#### Callbacks

| Prop           | Type                              | Description                          |
| -------------- | --------------------------------- | ------------------------------------ |
| `beforeChange` | `(current, next) => void`         | Called before slide change           |
| `afterChange`  | `(current) => void`               | Called after slide change            |
| `onInit`       | `() => void`                      | Called on slider initialization      |
| `onSwipe`      | `(direction: 'left'|'right') => void` | Called on swipe end              |
| `onEdge`       | `(direction: 'left'|'right') => void` | Called on edge reached           |

#### Customization

| Prop            | Type          | Default         | Description                          |
| --------------- | ------------- | --------------- | ------------------------------------ |
| `className`     | string        | `''`            | Additional CSS class                 |
| `dotsClass`     | string        | `'glide-dots'`  | Dots container class                 |
| `prevArrow`     | ReactElement  | `null`          | Custom previous arrow component      |
| `nextArrow`     | ReactElement  | `null`          | Custom next arrow component          |
| `customPaging`  | `(i) => ReactElement` | `null`  | Custom dot renderer                  |
| `appendDots`    | `(dots) => ReactElement` | `null` | Custom dots container           |

### Methods

Access these methods via ref:

```typescript
import { useRef } from 'react';
import Glide, { GlideRef } from 'glide-react';

const sliderRef = useRef<GlideRef>(null);

// Then use:
sliderRef.current?.next();
```

| Method                      | Arguments          | Description                          |
| --------------------------- | ------------------ | ------------------------------------ |
| `prev()`                    | None               | Go to previous slide                 |
| `next()`                    | None               | Go to next slide                     |
| `goTo(index, dontAnimate?)` | index, dontAnimate | Go to specific slide (0-indexed)     |
| `pause()`                   | None               | Pause autoplay                       |
| `play()`                    | None               | Start/resume autoplay                |

### Custom Next/Prev Arrows

To customize the next/prev arrow elements, create new React components and set them as the values of `nextArrow` and `prevArrow`.

```tsx
function CustomPrevArrow(props) {
  return <button {...props}>Previous</button>;
}

function CustomNextArrow(props) {
  return <button {...props}>Next</button>;
}

<Glide
  prevArrow={<CustomPrevArrow />}
  nextArrow={<CustomNextArrow />}
>
  {/* slides */}
</Glide>
```

**Important:** Be sure to pass your component's props to your clickable element like the example above. This ensures the click handler and other necessary props are properly attached. You can also use `onClick={props.onClick}` if you only want to set the click handler explicitly.

### Custom Paging (Dots)

Customize individual dot elements:

```tsx
<Glide
  dots={true}
  customPaging={(i) => (
    <button>
      {i + 1}
    </button>
  )}
>
  {/* slides */}
</Glide>
```

### Custom Dots Container

Customize the entire dots container:

```tsx
<Glide
  dots={true}
  appendDots={(dots) => (
    <div>
      <ul style={{ display: 'flex', justifyContent: 'center' }}>
        {dots}
      </ul>
    </div>
  )}
>
  {/* slides */}
</Glide>
```

### TypeScript Support

Glide React is written in TypeScript and provides full type definitions:

```typescript
import Glide, { GlideRef, GlideProps } from 'glide-react';

// Use GlideProps for component props
const settings: Partial<GlideProps> = {
  slidesToShow: 3,
  infinite: true,
};

// Use GlideRef for ref type
const sliderRef = useRef<GlideRef>(null);
```
