// This file contains all the code examples for easy reference
export const examples = {
  MultipleItems: `import React from "react";
import Glide from "glide-react";

function MultipleItems() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3
  };
  return (
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
        <div>
          <h3>7</h3>
        </div>
        <div>
          <h3>8</h3>
        </div>
        <div>
          <h3>9</h3>
        </div>
      </Glide>
    </div>
  );
}

export default MultipleItems;`,

  Responsive: `import React from "react";
import Glide from "glide-react";

function Responsive() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
        <div>
          <h3>7</h3>
        </div>
        <div>
          <h3>8</h3>
        </div>
      </Glide>
    </div>
  );
}

export default Responsive;`,

  AutoPlay: `import React from "react";
import Glide from "glide-react";

function AutoPlay() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
  };
  return (
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Glide>
    </div>
  );
}

export default AutoPlay;`,

  CenterMode: `import React from "react";
import Glide from "glide-react";

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
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Glide>
    </div>
  );
}

export default CenterMode;`,

  Fade: `import React from "react";
import Glide from "glide-react";

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
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
      </Glide>
    </div>
  );
}

export default Fade;`,

  VerticalMode: `import React from "react";
import Glide from "glide-react";

function VerticalMode() {
  const settings = {
    dots: true,
    vertical: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1
  };
  return (
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Glide>
    </div>
  );
}

export default VerticalMode;`,

  CustomArrows: `import React from "react";
import Glide from "glide-react";

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}

function CustomArrows() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };
  return (
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Glide>
    </div>
  );
}

export default CustomArrows;`,

  CustomPaging: `import React from "react";
import Glide from "glide-react";

function CustomPaging() {
  const settings = {
    dots: true,
    dotsClass: "glide-dots glide-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    customPaging: (i) => (
      <button>
        {i + 1}
      </button>
    )
  };
  return (
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Glide>
    </div>
  );
}

export default CustomPaging;`,

  PreviousNextMethods: `import React, { useRef, useState } from "react";
import Glide from "glide-react";

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
    <>
      <div className="button-group">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
        <button onClick={() => handleGoToSlide(0)}>Go to First</button>
        <button onClick={() => handleGoToSlide(3)}>Go to Fourth</button>
      </div>
      <div className="slider-container">
        <Glide ref={sliderRef} {...settings}>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Glide>
      </div>
    </>
  );
}

export default PreviousNextMethods;`,

  DynamicSlides: `import React, { useState } from "react";
import Glide from "glide-react";

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
    <>
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
    </>
  );
}

export default DynamicSlides;`,

  AutoPlayMethods: `import React, { useState, useRef } from "react";
import Glide from "glide-react";

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
    <>
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
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Glide>
      </div>
    </>
  );
}

export default AutoPlayMethods;`,

  SlideChangeHooks: `import React, { useState } from "react";
import Glide from "glide-react";

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
      setBeforeChangeInfo(\`Before change: \${current} → \${next}\`);
    },
    afterChange: (current) => {
      setAfterChangeInfo(\`After change: Now on slide \${current}\`);
    },
    onInit: () => {
      console.log('Slider initialized');
    }
  };

  return (
    <>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '4px' }}>
        <div><strong>{beforeChangeInfo || 'Before change info will appear here'}</strong></div>
        <div><strong>{afterChangeInfo || 'After change info will appear here'}</strong></div>
      </div>
      <div className="slider-container">
        <Glide {...settings}>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Glide>
      </div>
    </>
  );
}

export default SlideChangeHooks;`,

  Rtl: `import React from "react";
import Glide from "glide-react";

function Rtl() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    rtl: true
  };
  return (
    <div className="slider-container">
      <Glide {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Glide>
    </div>
  );
}

export default Rtl;`
};
