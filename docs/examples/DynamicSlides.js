import React, { useState } from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function DynamicSlides() {
  const [slides, setSlides] = useState([1, 2, 3, 4, 5, 6]);

  const addSlide = () => {
    setSlides([...slides, slides.length + 1]);
  };

  const removeSlide = () => {
    if (slides.length > 1) {
      setSlides(slides.slice(0, -1));
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };
  
  return (
    <div className="demo-section">
      <h2>Dynamic Slides</h2>
      <p className="description">
        Add or remove slides dynamically. The slider automatically adapts. Current slides: {slides.length}
      </p>
      <div className="button-group">
        <button onClick={addSlide}>Add Slide</button>
        <button onClick={removeSlide} disabled={slides.length <= 1}>
          Remove Slide
        </button>
      </div>
      <div className="slider-container">
        <Glide {...settings}>
          {slides.map((slide) => (
            <div key={slide}>
              <h3>{slide}</h3>
            </div>
          ))}
        </Glide>
      </div>
      <CodeBlock code={examples.DynamicSlides} />
    </div>
  );
}

export default DynamicSlides;
