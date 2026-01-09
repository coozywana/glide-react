import React from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function MultipleItems() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };
  
  return (
    <div className="demo-section">
      <h2>Multiple Items</h2>
      <p className="description">
        Show multiple slides at once. Great for product showcases and content grids.
      </p>
      <div className="slider-container">
        <Glide {...settings}>
          <div><h3>1</h3></div>
          <div><h3>2</h3></div>
          <div><h3>3</h3></div>
          <div><h3>4</h3></div>
          <div><h3>5</h3></div>
          <div><h3>6</h3></div>
          <div><h3>7</h3></div>
          <div><h3>8</h3></div>
          <div><h3>9</h3></div>
        </Glide>
      </div>
      <CodeBlock code={examples.MultipleItems} />
    </div>
  );
}

export default MultipleItems;
