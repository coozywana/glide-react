import React from 'react';
import SimpleSlider from './examples/SimpleSlider';
import MultipleItems from './examples/MultipleItems';
import Responsive from './examples/Responsive';
import AutoPlay from './examples/AutoPlay';
import AutoPlayMethods from './examples/AutoPlayMethods';
import CenterMode from './examples/CenterMode';
import Fade from './examples/Fade';
import VerticalMode from './examples/VerticalMode';
import CustomArrows from './examples/CustomArrows';
import CustomPaging from './examples/CustomPaging';
import PreviousNextMethods from './examples/PreviousNextMethods';
import DynamicSlides from './examples/DynamicSlides';
import SlideChangeHooks from './examples/SlideChangeHooks';
import Rtl from './examples/Rtl';

function Demos() {
  return (
    <div className="content">
      <SimpleSlider />
      <MultipleItems />
      <Responsive />
      <AutoPlay />
      <AutoPlayMethods />
      <CenterMode />
      <Fade />
      <VerticalMode />
      <CustomArrows />
      <CustomPaging />
      <PreviousNextMethods />
      <DynamicSlides />
      <SlideChangeHooks />
      <Rtl />
    </div>
  );
}

export default Demos;
