/**
 * High-quality image reader & compressor.
 * Preserves high resolution (1400px max dimension, 0.92 quality) while ensuring fast load times.
 * @param {File} file - The image file to compress
 * @param {function} callback - Called with the resulting high-quality base64 data URL
 */
export function compressAndReadImage(file, callback) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const rawDataUrl = e.target.result;

    // If file is under 400KB, use untouched original file data for 100% loss-free crisp quality
    if (file.size <= 400 * 1024) {
      callback(rawDataUrl);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      const MAX_SIZE = 1400; // Crisp high-definition resolution

      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Enable high-quality bicubic canvas interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (file.type === "image/png") {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Export at high 0.92 quality (preserving PNG format or high quality JPEG)
      try {
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const highQualityDataUrl = canvas.toDataURL(mimeType, 0.92);
        callback(highQualityDataUrl);
      } catch (err) {
        callback(canvas.toDataURL("image/jpeg", 0.90));
      }
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
}
