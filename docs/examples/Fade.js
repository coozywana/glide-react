import React from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function Fade() {
  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  
  return (
    <div className="demo-section">
      <h2>Fade</h2>
      <p className="description">
        Fade transition instead of sliding. Elegant for full-screen images and hero sections.
      </p>
      <div className="slider-container">
        <Glide {...settings}>
          <div><h3>1</h3></div>
          <div><h3>2</h3></div>
          <div><h3>3</h3></div>
          <div><h3>4</h3></div>
        </Glide>
      </div>
      <CodeBlock code={examples.Fade} />
    </div>
  );
}

export default Fade;
