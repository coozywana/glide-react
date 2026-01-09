import React, { useRef, useState } from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function PreviousNextMethods() {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevious = () => {
    sliderRef.current?.prev();
  };

  const handleNext = () => {
    sliderRef.current?.next();
  };

  const handleGoToSlide = (index) => {
    sliderRef.current?.goTo(index);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current)
  };
  
  return (
    <div className="demo-section">
      <h2>Previous/Next Methods</h2>
      <p className="description">
        Control the slider programmatically using ref methods. Current slide: {currentSlide + 1}
      </p>
      <div className="button-group">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
        <button onClick={() => handleGoToSlide(0)}>Go to First</button>
        <button onClick={() => handleGoToSlide(3)}>Go to Fourth</button>
      </div>
      <div className="slider-container">
        <Glide ref={sliderRef} {...settings}>
          <div><h3>1</h3></div>
          <div><h3>2</h3></div>
          <div><h3>3</h3></div>
          <div><h3>4</h3></div>
          <div><h3>5</h3></div>
          <div><h3>6</h3></div>
        </Glide>
      </div>
      <CodeBlock code={examples.PreviousNextMethods} />
    </div>
  );
}

export default PreviousNextMethods;
