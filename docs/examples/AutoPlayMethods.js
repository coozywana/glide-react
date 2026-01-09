import React, { useState, useRef } from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function AutoPlayMethods() {
  const sliderRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePause = () => {
    sliderRef.current?.pause();
    setIsPlaying(false);
  };

  const handlePlay = () => {
    sliderRef.current?.play();
    setIsPlaying(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  
  return (
    <div className="demo-section">
      <h2>Auto Play Methods</h2>
      <p className="description">
        Control autoplay programmatically. Status: {isPlaying ? 'Playing' : 'Paused'}
      </p>
      <div className="button-group">
        <button onClick={handlePlay} disabled={isPlaying}>
          Play
        </button>
        <button onClick={handlePause} disabled={!isPlaying}>
          Pause
        </button>
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
      <CodeBlock code={examples.AutoPlayMethods} />
    </div>
  );
}

export default AutoPlayMethods;
