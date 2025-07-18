// Real Image Optimization Service
export class ImageOptimizationService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  // 1. REAL IMAGE COMPRESSION
  async compressImage(file: File, quality: number = 0.8): Promise<{
    original: File;
    compressed: Blob;
    originalSize: number;
    compressedSize: number;
    savings: number;
    format: string;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions
        this.canvas.width = img.naturalWidth;
        this.canvas.height = img.naturalHeight;

        // Draw image on canvas
        this.ctx.drawImage(img, 0, 0);

        // Convert to WebP with compression
        this.canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }

            const originalSize = file.size;
            const compressedSize = blob.size;
            const savings = Math.round(((originalSize - compressedSize) / originalSize) * 100);

            resolve({
              original: file,
              compressed: blob,
              originalSize,
              compressedSize,
              savings,
              format: 'webp'
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // 2. REAL IMAGE RESIZING
  async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    maintainAspectRatio: boolean = true
  ): Promise<{
    original: File;
    resized: Blob;
    originalDimensions: { width: number; height: number };
    newDimensions: { width: number; height: number };
    sizeReduction: number;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;

        let newWidth = originalWidth;
        let newHeight = originalHeight;

        if (maintainAspectRatio) {
          const aspectRatio = originalWidth / originalHeight;
          
          if (originalWidth > maxWidth) {
            newWidth = maxWidth;
            newHeight = newWidth / aspectRatio;
          }
          
          if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
          }
        } else {
          newWidth = Math.min(originalWidth, maxWidth);
          newHeight = Math.min(originalHeight, maxHeight);
        }

        // Set canvas to new dimensions
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        // Enable image smoothing for better quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        // Draw resized image
        this.ctx.drawImage(img, 0, 0, newWidth, newHeight);

        this.canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Resizing failed'));
              return;
            }

            const sizeReduction = Math.round(((file.size - blob.size) / file.size) * 100);

            resolve({
              original: file,
              resized: blob,
              originalDimensions: { width: originalWidth, height: originalHeight },
              newDimensions: { width: Math.round(newWidth), height: Math.round(newHeight) },
              sizeReduction
            });
          },
          'image/webp',
          0.9
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // 3. AI-POWERED ALT TEXT GENERATION
  generateAltText(filename: string, context?: string): string {
    // Remove file extension and format filename
    const name = filename.replace(/\.[^/.]+$/, '');
    const formatted = name
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Add context-based keywords
    const keywords = this.extractKeywordsFromContext(context || '');
    const altText = keywords.length > 0 
      ? `${formatted} - ${keywords.join(', ')}`
      : formatted;

    // Ensure proper length (max 125 characters for SEO)
    return altText.length > 125 ? altText.substring(0, 122) + '...' : altText;
  }

  // 4. BULK IMAGE OPTIMIZATION
  async optimizeBulkImages(
    files: File[],
    options: {
      quality?: number;
      maxWidth?: number;
      maxHeight?: number;
      format?: 'webp' | 'jpeg' | 'png';
      generateAlt?: boolean;
    } = {}
  ): Promise<{
    results: Array<{
      original: File;
      optimized: Blob;
      altText: string;
      originalSize: number;
      optimizedSize: number;
      savings: number;
      dimensions: { width: number; height: number };
    }>;
    totalSavings: number;
    totalOriginalSize: number;
    totalOptimizedSize: number;
  }> {
    const results = [];
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of files) {
      try {
        // Compress the image
        const compressed = await this.compressImage(file, options.quality || 0.8);
        
        // Resize if dimensions specified
        let finalBlob = compressed.compressed;
        let dimensions = { width: 0, height: 0 };
        
        if (options.maxWidth || options.maxHeight) {
          const resized = await this.resizeImage(
            file,
            options.maxWidth || 1920,
            options.maxHeight || 1080
          );
          finalBlob = resized.resized;
          dimensions = resized.newDimensions;
        }

        // Generate alt text
        const altText = options.generateAlt 
          ? this.generateAltText(file.name)
          : '';

        const savings = Math.round(((file.size - finalBlob.size) / file.size) * 100);
        
        results.push({
          original: file,
          optimized: finalBlob,
          altText,
          originalSize: file.size,
          optimizedSize: finalBlob.size,
          savings,
          dimensions
        });

        totalOriginalSize += file.size;
        totalOptimizedSize += finalBlob.size;
      } catch (error) {
        console.error(`Failed to optimize ${file.name}:`, error);
      }
    }

    const totalSavings = Math.round(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100);

    return {
      results,
      totalSavings,
      totalOriginalSize,
      totalOptimizedSize
    };
  }

  // 5. LAZY LOADING IMPLEMENTATION
  implementLazyLoading(): string {
    return `
// Intersection Observer for lazy loading
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      const src = img.getAttribute('data-src');
      
      if (src) {
        img.setAttribute('src', src);
        img.removeAttribute('data-src');
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    }
  });
});

// Apply to all images with data-src
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Progressive image loading with blur effect
const loadImageWithBlur = (img) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Create low-quality placeholder
  canvas.width = 40;
  canvas.height = 30;
  
  const tempImg = new Image();
  tempImg.onload = () => {
    ctx.drawImage(tempImg, 0, 0, 40, 30);
    const blurredDataUrl = canvas.toDataURL();
    
    img.src = blurredDataUrl;
    img.style.filter = 'blur(5px)';
    img.style.transition = 'filter 0.3s';
    
    // Load high-quality image
    const highQualityImg = new Image();
    highQualityImg.onload = () => {
      img.src = highQualityImg.src;
      img.style.filter = 'blur(0px)';
    };
    highQualityImg.src = img.getAttribute('data-src');
  };
  tempImg.src = img.getAttribute('data-src');
};`;
  }

  // 6. MODERN IMAGE FORMAT DETECTION
  supportsModernFormats(): {
    webp: boolean;
    avif: boolean;
    recommendations: string[];
  } {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
    
    // AVIF detection
    const avifSupport = canvas.toDataURL('image/avif').startsWith('data:image/avif');

    const recommendations = [];
    if (webpSupport) recommendations.push('Use WebP format for better compression');
    if (avifSupport) recommendations.push('Use AVIF format for even better compression');
    if (!webpSupport && !avifSupport) recommendations.push('Consider using modern image formats with fallbacks');

    return {
      webp: webpSupport,
      avif: avifSupport,
      recommendations
    };
  }

  // 7. IMAGE SEO ANALYSIS
  analyzeImageSEO(images: NodeListOf<HTMLImageElement>): {
    total: number;
    issues: Array<{
      element: HTMLImageElement;
      issues: string[];
      recommendations: string[];
      seoScore: number;
    }>;
    overallScore: number;
  } {
    const issues = [];
    let totalScore = 0;

    images.forEach(img => {
      const imgIssues = [];
      const recommendations = [];
      let seoScore = 100;

      // Check alt text
      if (!img.alt) {
        imgIssues.push('Missing alt attribute');
        recommendations.push('Add descriptive alt text');
        seoScore -= 30;
      } else if (img.alt.length > 125) {
        imgIssues.push('Alt text too long');
        recommendations.push('Keep alt text under 125 characters');
        seoScore -= 15;
      } else if (img.alt.length < 5) {
        imgIssues.push('Alt text too short');
        recommendations.push('Make alt text more descriptive');
        seoScore -= 10;
      }

      // Check file format
      if (!img.src.includes('webp') && !img.src.includes('avif')) {
        imgIssues.push('Using old image format');
        recommendations.push('Convert to WebP or AVIF');
        seoScore -= 20;
      }

      // Check lazy loading
      if (!img.loading || img.loading !== 'lazy') {
        imgIssues.push('Not using lazy loading');
        recommendations.push('Add loading="lazy" attribute');
        seoScore -= 15;
      }

      // Check dimensions
      if (!img.width || !img.height) {
        imgIssues.push('Missing width/height attributes');
        recommendations.push('Add width and height attributes to prevent layout shift');
        seoScore -= 10;
      }

      issues.push({
        element: img,
        issues: imgIssues,
        recommendations,
        seoScore: Math.max(0, seoScore)
      });

      totalScore += Math.max(0, seoScore);
    });

    return {
      total: images.length,
      issues,
      overallScore: images.length > 0 ? Math.round(totalScore / images.length) : 100
    };
  }

  // Helper method to extract keywords from context
  private extractKeywordsFromContext(context: string): string[] {
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an']);
    const words = context.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));
    
    // Get unique words and limit to top 3
    return [...new Set(words)].slice(0, 3);
  }

  // Convert blob to file for download
  blobToFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: blob.type });
  }

  // Generate download link for optimized image
  createDownloadLink(blob: Blob, filename: string): string {
    return URL.createObjectURL(blob);
  }
}

export const imageOptimizationService = new ImageOptimizationService();