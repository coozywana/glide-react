import React, { useRef } from 'react'
import Glide from 'glide-react'

export default function App() {
  const ref = useRef(null)

  return (
    <div className="app">
      <h1>glide-react playground</h1>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Glide
          ref={ref}
          slidesToShow={3}
          slidesToScroll={1}
          dots={true}
          arrows={true}
          autoplay={true}
          autoplaySpeed={2000}
          className="my-glide"
        >
          <div className="slide">Slide 1</div>
          <div className="slide">Slide 2</div>
          <div className="slide">Slide 3</div>
          <div className="slide">Slide 4</div>
          <div className="slide">Slide 5</div>
        </Glide>

        <div className="controls">
          <button onClick={() => ref.current?.prev()}>Prev</button>
          <button onClick={() => ref.current?.next()}>Next</button>
          <button onClick={() => ref.current?.goTo(0)}>Go to first</button>
          <button onClick={() => ref.current?.pause()}>Pause</button>
          <button onClick={() => ref.current?.play()}>Play</button>
        </div>
      </div>

      <footer style={{ marginTop: 24, textAlign: 'center' }}>
        <small>Test package: npm install glide-react</small>
      </footer>
    </div>
  )
}
