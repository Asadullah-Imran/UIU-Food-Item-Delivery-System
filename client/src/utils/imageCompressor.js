/**
 * Client-Side Image Compression Utility
 * Resizes and compresses any image file in-browser using HTML5 Canvas.
 * Allows shop owners to upload any image size (e.g. 10MB - 50MB) without timeouts or bandwidth waste.
 * 
 * @param {File} file - Original file from <input type="file" />
 * @param {Object} options - Compression settings
 * @param {number} options.maxWidth - Maximum allowed width (default 1600px)
 * @param {number} options.maxHeight - Maximum allowed height (default 1600px)
 * @param {number} options.quality - Output quality between 0.1 and 1.0 (default 0.8)
 * @param {string} options.outputType - Output MIME format (default 'image/jpeg')
 * @returns {Promise<File>} Compressed File ready for FormData
 */
export const compressImage = (file, {
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.8,
  outputType = 'image/jpeg'
} = {}) => {
  return new Promise((resolve, reject) => {
    // If not an image, return original
    if (!file || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio-preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Render to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas back to compressed Blob/File
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file); // Fallback to original
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + '.jpg', {
              type: outputType,
              lastModified: Date.now()
            });

            console.log(`[Image Compressor] Original: ${(file.size / 1024 / 1024).toFixed(2)} MB -> Compressed: ${(compressedFile.size / 1024).toFixed(2)} KB`);
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = () => resolve(file); // Fallback if image fails to decode
      img.src = readerEvent.target.result;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};
