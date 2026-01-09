import React from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function CenterMode() {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500
  };
  
  return (
    <div className="demo-section">
      <h2>Center Mode</h2>
      <p className="description">
        Center the active slide with partial views of adjacent slides.
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
      <CodeBlock code={examples.CenterMode} />
    </div>
  );
}

export default CenterMode;
