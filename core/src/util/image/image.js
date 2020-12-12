/**
 * @param image
 * @param options
 * @returns {Promise}
 */
export function resize(sourceImage, options) {
  return new Promise((resolve, reject) => {
    const resizedImage = new Image();
    resizedImage.onload = () => {
      const sourceWidth = resizedImage.width;
      const sourceHeight = resizedImage.height;

      let targetWidth = sourceWidth;
      let targetHeight = sourceHeight;

      const { maxSize } = options;
      if (maxSize) {
        if (sourceWidth >= sourceHeight) {
          targetWidth = maxSize;
          targetHeight = sourceHeight * (maxSize / sourceWidth);
        } else {
          targetHeight = maxSize;
          targetWidth = sourceWidth * (maxSize / sourceHeight);
        }
      }

      const elem = document.createElement('canvas');
      elem.width = targetWidth;
      elem.height = targetHeight;

      const ctx = elem.getContext('2d');
      ctx.drawImage(resizedImage, 0, 0, targetWidth, targetHeight);

      const format = options.format || 'blob';
      const mimetype = options.mimetype || 'image/jpeg';
      const quality = options.quality || 0.92;

      switch (format) {
        case 'data':
          const resizedImageData = ctx.canvas.toDataURL(resizedImage, mimetype, quality);
          resolve(resizedImageData);
          break;
        case 'blob':
          ctx.canvas.toBlob((resizedImageBlob) => {
            resolve(resizedImageBlob);
          }, mimetype, quality);
          break;
        default:
          throw new Error(`Unsupported output format: ${format}`);
      }
    };
    resizedImage.src = sourceImage;
  });
}
