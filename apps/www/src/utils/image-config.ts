export const imageConfig = {
  avif: {
    lossless: false,
    quality: 85,
    speed: 5,
  },
  jpeg: {
    mozjpeg: true,
    optimizeScans: true,
    progressive: true,
    quality: 85,
  },
  limitInputPixels: 268_402_689,
  png: {
    adaptiveFiltering: true,
    compressionLevel: 9,
    progressive: true,
    quality: 85,
  },
  webp: {
    lossless: false,
    nearLossless: true,
    quality: 85,
    smartSubsample: true,
  },
};
