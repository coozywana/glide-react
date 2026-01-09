import React from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function VerticalMode() {
  const settings = {
    dots: true,
    vertical: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1
  };
  
  return (
    <div className="demo-section">
      <h2>Vertical Mode</h2>
      <p className="description">
        Slides move vertically instead of horizontally.
      </p>
      <div className="slider-container">
        <Glide {...settings}>
          <div><h3>1</h3></div>
          <div><h3>2</h3></div>
          <div><h3>3</h3></div>
          <div><h3>4</h3></div>
          <div><h3>5</h3></div>
          <div><h3>6</h3></div>
        </Glide>
      </div>
      <CodeBlock code={examples.VerticalMode} />
    </div>
  );
}

export default VerticalMode;
