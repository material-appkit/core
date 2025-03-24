import PropTypes from 'prop-types';
import React from 'react';

/**
 * Find the source of an image to use as a key in the image cache.
 */
const getImageSrcKey = (props) => {
  return props.src;
};

// Cache if we've seen an image before so we don't bother with
// lazy-loading & fading in on subsequent mounts.
const imageCache = Object.create({});

const inImageCache = (props) => {
  // Find src
  const src = getImageSrcKey(props);
  return imageCache[src] || false;
};


const activateCacheForImage = (props) => {
  // Find src
  const src = getImageSrcKey(props);
  imageCache[src] = true;
};


// Native lazy-loading support: https://addyosmani.com/blog/lazy-loading/
const hasNativeLazyLoadSupport =
  typeof HTMLImageElement !== 'undefined' &&
  'loading' in HTMLImageElement.prototype;

const isBrowser = typeof window !== `undefined`;
const hasIOSupport = isBrowser && window.IntersectionObserver;

let io;
const listeners = new WeakMap();

function getIO() {
  if (
    typeof io === `undefined` &&
    typeof window !== `undefined` &&
    window.IntersectionObserver
  ) {
    io = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (listeners.has(entry.target)) {
            const cb = listeners.get(entry.target);
            // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
              io.unobserve(entry.target);
              listeners.delete(entry.target);
              cb();
            }
          }
        })
      },
      { rootMargin: `200px` }
    )
  }

  return io;
}


const listenToIntersections = (el, cb) => {
  const observer = getIO();

  if (observer) {
    observer.observe(el);
    listeners.set(el, cb);
  }

  return () => {
    observer.unobserve(el);
    listeners.delete(el);
  }
};


//------------------------------------------------------------------------------
const Img = React.forwardRef((props, ref) => {
  const {
    alt,
    src,
    style,
    objectFit,
    onLoad,
    onError,
    loading,
    ...otherProps
  } = props;

  return (
    <img
      alt={alt}
      src={src}
      {...otherProps}
      onLoad={onLoad}
      onError={onError}
      ref={ref}
      loading={loading}
      style={{
        position: `absolute`,
        top: 0,
        left: 0,
        width: `100%`,
        height: `100%`,
        objectFit,
        objectPosition: `center`,
        ...style,
      }}
    />
  )
});

Img.propTypes = {
  alt: PropTypes.string,
  loading: PropTypes.string,
  objectFit: PropTypes.string,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  src: PropTypes.string,
  style: PropTypes.object,
};

//------------------------------------------------------------------------------
// Earlier versions of gatsby-image during the 2.x cycle did not wrap
// the `Img` component in a `picture` element. This maintains compatibility
// until a breaking change can be introduced in the next major release
function Placeholder({ src, spreadProps }) {
  return <Img src={src} {...spreadProps} />;
}

Placeholder.propTypes = {
  src: PropTypes.string,
  spreadProps: PropTypes.object,
};

//------------------------------------------------------------------------------
class Image extends React.Component {
  constructor(props) {
    super(props);

    // If this image has already been loaded before then we can assume it's
    // already in the browser cache so it's cheap to just show directly.
    this.seenBefore = isBrowser && inImageCache(props);

    this.isCritical = props.loading === `eager` || props.critical;

    this.addNoScript = !(this.isCritical && !props.fadeIn);
    this.useIOSupport =
      !hasNativeLazyLoadSupport &&
      hasIOSupport &&
      !this.isCritical &&
      !this.seenBefore;

    const isVisible =
      this.isCritical ||
      (isBrowser && (hasNativeLazyLoadSupport || !this.useIOSupport));

    this.state = {
      isVisible,
      imgLoaded: false,
      imgCached: false,
      fadeIn: !this.seenBefore && props.fadeIn,
    };

    this.imageRef = React.createRef();
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }


  componentDidMount() {
    if (this.state.isVisible && typeof this.props.onStartLoad === `function`) {
      this.props.onStartLoad({ wasCached: inImageCache(this.props) });
    }

    if (this.isCritical) {
      const img = this.imageRef.current;
      if (img && img.complete) {
        this.handleImageLoaded();
      }
    }
  }


  componentWillUnmount() {
    if (this.cleanUpListeners) {
      this.cleanUpListeners();
    }
  }

  // Specific to IntersectionObserver based lazy-load support
  handleRef(ref) {
    if (this.useIOSupport && ref) {
      this.cleanUpListeners = listenToIntersections(ref, () => {
        const imageInCache = inImageCache(this.props);
        if (
          !this.state.isVisible &&
          typeof this.props.onStartLoad === `function`
        ) {
          this.props.onStartLoad({ wasCached: imageInCache });
        }

        // imgCached and imgLoaded must update after isVisible,
        // Once isVisible is true, imageRef becomes accessible, which imgCached needs access to.
        // imgLoaded and imgCached are in a 2nd setState call to be changed together,
        // avoiding initiating unnecessary animation frames from style changes.
        this.setState({ isVisible: true }, () =>
          this.setState({
            imgLoaded: imageInCache,
            // `currentSrc` should be a string, but can be `undefined` in IE,
            // !! operator validates the value is not undefined/null/""
            imgCached: !!this.imageRef.current.currentSrc,
          })
        );
      })
    }
  }


  handleImageLoaded() {
    activateCacheForImage(this.props);

    this.setState({ imgLoaded: true });

    if (this.props.onLoad) {
      this.props.onLoad();
    }
  }


  render() {
    const {
      title,
      alt,
      className,
      style = {},
      imgStyle = {},
      placeholderStyle = {},
      placeholderClassName,
      backgroundColor,
      durationFadeIn,
      Tag,
      itemProp,
      loading,
      src,
    } = this.props;

    const shouldReveal = this.state.fadeIn === false || this.state.imgLoaded;
    const shouldFadeIn = this.state.fadeIn === true && !this.state.imgCached;

    const imageStyle = {
      opacity: shouldReveal ? 1 : 0,
      transition: shouldFadeIn ? `opacity ${durationFadeIn}ms` : `none`,
      ...imgStyle,
    };

    const bgColor =
      typeof backgroundColor === `boolean` ? `lightgray` : backgroundColor;

    const delayHideStyle = {
      transitionDelay: `${durationFadeIn}ms`,
    };

    const imagePlaceholderStyle = {
      opacity: this.state.imgLoaded ? 0 : 1,
      objectFit: this.props.objectFit,
      ...(shouldFadeIn && delayHideStyle),
      ...imgStyle,
      ...placeholderStyle,
    };

    const placeholderImageProps = {
      title,
      alt: !this.state.isVisible ? alt : ``,
      style: imagePlaceholderStyle,
      className: placeholderClassName,
      itemProp,
    };


    return (
      <Tag
        className={className}
        style={{
          position: `relative`,
          overflow: `hidden`,
          ...style,
        }}
        ref={this.handleRef}
        key={src}
      >
        {/* Preserve the aspect ratio. */}
        <Tag
          style={{
            width: `100%`,
            paddingBottom: `${100 / this.props.aspectRatio}%`,
          }}
        />

        {/* Show a solid background color. */}
        {bgColor && (
          <Tag
            title={title}
            style={{
              backgroundColor: bgColor,
              position: `absolute`,
              top: 0,
              bottom: 0,
              opacity: !this.state.imgLoaded ? 1 : 0,
              right: 0,
              left: 0,
              ...(shouldFadeIn && delayHideStyle),
            }}
          />
        )}

        {/* Show the blurry base64 image. */}
        {this.props.placeholder && (
          <Placeholder
            src={this.props.placeholder}
            spreadProps={placeholderImageProps}
          />
        )}

        {/* Once the image is visible (or the browser doesn't support IntersectionObserver), start downloading the image */}
        {this.state.isVisible && (
          <picture>
            {/*{generateImageSources(imageVariants)}*/}
            <Img
              alt={alt}
              title={title}
              src={src}
              crossOrigin={this.props.crossOrigin}
              style={imageStyle}
              ref={this.imageRef}
              objectFit={this.props.objectFit}
              onLoad={this.handleImageLoaded}
              onClick={this.props.onClick}
              onError={this.props.onError}
              itemProp={itemProp}
              loading={loading}
            />
          </picture>
        )}
      </Tag>
    );
  }
}

Image.propTypes = {
  aspectRatio: PropTypes.number,
  fadeIn: PropTypes.bool,
  durationFadeIn: PropTypes.number,
  title: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), // Support Glamor's css prop.
  critical: PropTypes.bool,
  crossOrigin: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  style: PropTypes.object,
  imgStyle: PropTypes.object,
  placeholder: PropTypes.string,
  placeholderStyle: PropTypes.object,
  placeholderClassName: PropTypes.string,
  backgroundColor: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  objectFit: PropTypes.oneOf(['fill', 'contain', 'cover', 'scale-down', 'none']),
  onClick: PropTypes.func,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  onStartLoad: PropTypes.func,
  src: PropTypes.string,
  Tag: PropTypes.string,
  itemProp: PropTypes.string,
  loading: PropTypes.oneOf([`auto`, `lazy`, `eager`]),
};


Image.defaultProps = {
  alt: '',
  aspectRatio: 1,
  critical: false,
  durationFadeIn: 500,
  fadeIn: true,
  // We set it to `lazy` by default because it's best to default to a performant
  // setting and let the user "opt out" to `eager`
  loading: `lazy`,
  objectFit: 'cover',
  Tag: `div`,
};

export default React.memo(Image);
