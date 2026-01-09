import React, { useState } from 'react';
import Glide from 'glide-react';
import CodeBlock from '../CodeBlock';
import { examples } from '../exampleCode';

function SlideChangeHooks() {
  const [beforeChangeInfo, setBeforeChangeInfo] = useState('');
  const [afterChangeInfo, setAfterChangeInfo] = useState('');

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      setBeforeChangeInfo(`Before change: ${current + 1} → ${next + 1}`);
    },
    afterChange: (current) => {
      setAfterChangeInfo(`After change: Now on slide ${current + 1}`);
    },
    onInit: () => {
      console.log('Slider initialized');
    }
  };
  
  return (
    <div className="demo-section">
      <h2>Slide Change Hooks</h2>
      <p className="description">
        Use callbacks to track slide changes and perform actions.
      </p>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '4px' }}>
        <div><strong>{beforeChangeInfo || 'Before change info will appear here'}</strong></div>
        <div><strong>{afterChangeInfo || 'After change info will appear here'}</strong></div>
      </div>
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
      <CodeBlock code={examples.SlideChangeHooks} />
    </div>
  );
}

export default SlideChangeHooks;
