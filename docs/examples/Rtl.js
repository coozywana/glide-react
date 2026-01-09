import React from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function Rtl() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    rtl: true
  };
  
  return (
    <div className="demo-section">
      <h2>Right to Left (RTL)</h2>
      <p className="description">
        Slider with right-to-left direction. Essential for RTL languages like Arabic and Hebrew.
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
      <CodeBlock code={examples.Rtl} />
    </div>
  );
}

export default Rtl;
