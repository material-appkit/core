import PropTypes from 'prop-types';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import MobileStepper from '@material-ui/core/MobileStepper';
import { makeStyles } from '@material-ui/core/styles';

const swipeViewStyles = makeStyles({
  swipe: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
  },

  swipeWrap: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
  },

  swipeItem: {
    overflow: 'hidden',
    position: 'relative',
    float: 'left',
    height: '100%',
    width: '100%',
  }
});

import Swipe from 'swipejs';

function SwipeView(props) {
  const classes = swipeViewStyles();

  const {
    active = true,
    keyboardDisabled = false,
    frames,
    onFocusChange,
    onSwipeUpdate,
    startSlide,
  } = props;

  const swipeRef = useRef(undefined);

  const handleKeyDown = useCallback((e) => {
    if (keyboardDisabled || !swipeRef.current) {
      return;
    }

    switch (e.key) {
      case "Left":
      case "ArrowLeft":
        swipeRef.current.prev();
        break;
      case "Right":
      case "ArrowRight":
        swipeRef.current.next();
        break;
      default:
        return;
    }
  }, [keyboardDisabled]);


  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);


  // ---------------------------------------------------------------------------
  const handleSwipeContentChange = useCallback((swipeEl) => {
    let swipeItems;
    let frameCount;

    if (swipeEl) {
      const swipeWrap = swipeEl.children[0];
      swipeItems = swipeWrap.children;
      frameCount = swipeItems.length;
    }

    function loadFrameAtIndex(index) {
      const frameIndex = (index < 0) ? index + frameCount : index % frameCount;
      const swipeItem = swipeItems[frameIndex];
      if (!swipeItem) {
        return;
      }

      const image = swipeItem.querySelector('img');
      if (image && !image.src && image.dataset.src) {
        image.src = image.dataset.src;
      }

      return image;
    }

    function handleFocusIndexChange(focusIndex) {
      const frame = loadFrameAtIndex(focusIndex);
      loadFrameAtIndex(focusIndex + 1);

      if (onFocusChange) {
        onFocusChange(focusIndex, frame);
      }
    }

    if (swipeRef.current) {
      swipeRef.current.kill();
    }
    swipeRef.current = undefined;

    if (swipeEl && active) {
      const frameCount = frames ? frames.length : 0;

      swipeRef.current = new Swipe(swipeEl, {
        draggable: true,
        startSlide,
        continuous: frameCount > 3,
        speed: 400,
        transitionEnd: (index) => {
          handleFocusIndexChange(index);
        },
      });

      if (onSwipeUpdate) {
        onSwipeUpdate(swipeRef.current);
      }
    }
  }, [active, frames, onFocusChange, onSwipeUpdate]);


  // ---------------------------------------------------------------------------
  return (
    <div ref={handleSwipeContentChange} className={classes.swipe}>
      <div className={classes.swipeWrap}>
        {frames.map((frame, frameIndex) => (
          <div key={frameIndex} className={classes.swipeItem}>
            {frame}
          </div>
        ))}
      </div>
    </div>
  );
}

SwipeView.propTypes = {
  active: PropTypes.bool,
  keyboardDisabled: PropTypes.bool,
  frames: PropTypes.array.isRequired,
  onFocusChange: PropTypes.func,
  onSwipeUpdate: PropTypes.func,
  startSlide: PropTypes.number,
};


// -----------------------------------------------------------------------------
const slideshowViewStyles = makeStyles({
  root: {
    height: '100%',
    position: 'relative',
  },

  mobileStepper: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0, right: 0,
    bottom: 0,
  },

  mobileStepperDots: {
    display: 'grid',
    justifyContent: 'center',
    gap: 5,
    gridAutoFlow: 'dense',
    gridTemplateColumns: 'repeat(auto-fit, 6px)',
    width: '100%',
  },

  mobileStepperDotActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});


function Slideshow(props) {
  const classes = slideshowViewStyles();

  const { frames, onFocusChange, startSlide } = props;

  const [focusIndex, setFocusIndex] = useState(startSlide);

  useEffect(() => {
    setFocusIndex(startSlide);
  }, [startSlide]);


  const handleSwipeFocusChange = useCallback((frameIndex, frame) => {
    setFocusIndex(frameIndex);

    if (onFocusChange) {
      onFocusChange(frameIndex, frame);
    }
  }, [onFocusChange]);


  return (
    <div className={classes.root}>
      <SwipeView
        frames={frames}
        onFocusChange={handleSwipeFocusChange}
        startSlide={startSlide}
      />

      {frames.length > 1 && (
        <MobileStepper
          classes={{
            root: classes.mobileStepper,
            dots: classes.mobileStepperDots,
            dotActive: classes.mobileStepperDotActive,
          }}

          position="static"
          activeStep={focusIndex}
          steps={frames.length}
        />
      )}
    </div>
  );
}

Slideshow.propTypes = SwipeView.propTypes;

export default React.memo(Slideshow);
