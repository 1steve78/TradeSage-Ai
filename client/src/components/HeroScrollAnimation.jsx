import React, { useEffect, useRef, useState, useCallback } from 'react';

// Props allow passing in a different folder, frame count, or extension
const HeroScrollAnimation = ({
  frameCount = 96,
  imagePrefix = 'ezgif-frame-',
  imageExtension = 'jpg',
  imageFolder = '/'
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Refs for text overlay containers to avoid React state re-renders on scroll
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);

  const [images, setImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const currentFrameIndexRef = useRef(0);
  const animationFrameId = useRef(null);
  const resizeTimeoutRef = useRef(null);

  // Respect reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Preload images concurrently
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const loadedImagesArr = new Array(frameCount);
    const promises = [];

    for (let i = 1; i <= frameCount; i++) {
      promises.push(
        new Promise((resolve) => {
          const img = new Image();
          const paddedIndex = i.toString().padStart(3, '0');
          img.src = `${imageFolder}${imagePrefix}${paddedIndex}.${imageExtension}`;

          img.onload = () => {
            if (cancelled) return resolve();
            count++;
            setLoadedCount(count);
            loadedImagesArr[i - 1] = img;
            resolve();
          };

          img.onerror = () => {
            if (cancelled) return resolve();
            count++;
            setLoadedCount(count);
            resolve(); // Resolve to not block Promise.all
          };
        })
      );
    }

    Promise.all(promises).then(() => {
      if (cancelled) return;
      const validImages = loadedImagesArr.filter(Boolean);
      setImages(validImages);
      setIsLoaded(true);
      // If more than 20% of frames failed, flag it so we can degrade gracefully
      if (validImages.length < frameCount * 0.8) {
        setLoadFailed(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [frameCount, imagePrefix, imageExtension, imageFolder]);

  // Canvas drawing logic
  const renderCanvas = useCallback((frameIndex) => {
    if (!canvasRef.current || images.length === 0 || !images[frameIndex]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency
    const img = images[frameIndex];

    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    // object-fit: cover logic
    if (canvasRatio > imgRatio) {
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  // Handle Resize (debounced)
  useEffect(() => {
    if (!isLoaded) return;

    const applyResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        renderCanvas(currentFrameIndexRef.current);
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(applyResize, 100);
    };

    window.addEventListener('resize', handleResize);
    applyResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutRef.current);
    };
  }, [isLoaded, renderCanvas]);

  // Handle Scroll and UI Updates
  useEffect(() => {
    if (!isLoaded || !containerRef.current || prefersReducedMotion) return;

    const handleScroll = () => {
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const { top, height } = containerRef.current.getBoundingClientRect();
          const scrollY = -top;
          const maxScroll = height - window.innerHeight;

          // Guard against divide-by-zero / negative range on short viewports
          let scrollFraction = maxScroll > 0 ? scrollY / maxScroll : 0;
          scrollFraction = Math.max(0, Math.min(1, scrollFraction));

          // 1. Update Canvas
          const maxFrameIndex = images.length - 1;
          const frameIndex = Math.floor(scrollFraction * maxFrameIndex);

          if (frameIndex !== currentFrameIndexRef.current && frameIndex >= 0 && frameIndex <= maxFrameIndex) {
            currentFrameIndexRef.current = frameIndex;
            renderCanvas(frameIndex);
          }

          // 2. Update DOM Overlays directly for performance
          if (text1Ref.current) {
            const opacity = scrollFraction >= 0 && scrollFraction < 0.25 ? 1 : 0;
            const translateY = scrollFraction * 100;
            text1Ref.current.style.opacity = opacity;
            text1Ref.current.style.transform = `translateY(${translateY}px)`;
            text1Ref.current.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
          }

          if (text2Ref.current) {
            let opacity = 0;
            if (scrollFraction >= 0.3 && scrollFraction < 0.6) opacity = 1;
            else if (scrollFraction >= 0.25 && scrollFraction < 0.3) opacity = (scrollFraction - 0.25) * 20;
            else if (scrollFraction >= 0.6 && scrollFraction < 0.65) opacity = 1 - (scrollFraction - 0.6) * 20;

            const translateY = 50 - ((scrollFraction - 0.3) * 200);
            text2Ref.current.style.opacity = Math.max(0, Math.min(1, opacity));
            text2Ref.current.style.transform = `translateY(${translateY}px)`;
            text2Ref.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
          }

          if (text3Ref.current) {
            let opacity = 0;
            if (scrollFraction >= 0.7) opacity = Math.min(1, (scrollFraction - 0.7) * 10);

            const scale = 0.95 + Math.min(0.05, Math.max(0, scrollFraction - 0.7));
            text3Ref.current.style.opacity = Math.max(0, Math.min(1, opacity));
            text3Ref.current.style.transform = `scale(${scale})`;
            text3Ref.current.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
          }

          animationFrameId.current = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isLoaded, renderCanvas, images.length, prefersReducedMotion]);

  // Reduced-motion / load-failure fallback: static frame, normal document flow, no pinning
  if (prefersReducedMotion || (isLoaded && loadFailed)) {
    const fallbackFrame = images[Math.floor(images.length / 2)] || images[0];
    return (
      <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {fallbackFrame && (
          <img
            src={fallbackFrame.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="relative z-10 text-center px-6">
          <h1 className="font-['Hanken_Grotesk'] text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Step Into The Light
          </h1>
          <p className="font-['JetBrains_Mono'] text-xl text-gray-300">
            A new era of AI trading.
          </p>
        </div>
      </section>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F172A] text-white" role="status" aria-live="polite">
        <div className="font-['Hanken_Grotesk'] text-2xl mb-6 font-semibold tracking-wide">
          Initializing Engine
        </div>
        <div className="w-64 h-1.5 bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-[#F7F9FB] transition-all duration-300 ease-out"
            style={{ width: `${(loadedCount / frameCount) * 100}%` }}
          />
        </div>
        <div className="font-['JetBrains_Mono'] text-xs mt-3 text-gray-500 tracking-widest">
          {Math.round((loadedCount / frameCount) * 100)}%
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#000000]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Decorative canvas — real content lives in the text overlays below */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="w-full h-full object-cover transform-gpu"
          style={{ width: '100vw', height: '100vh' }}
        />

        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">

          {/* Checkpoint 1: Headline */}
          <div
            ref={text1Ref}
            className="absolute text-center transition-opacity duration-300 will-change-transform will-change-opacity px-6"
            style={{ opacity: 1, transform: 'translateY(0px)' }}
          >
            <h1 className="font-['Hanken_Grotesk'] text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Step Into The Light
            </h1>
            <p className="font-['JetBrains_Mono'] text-xl text-gray-300">
              A new era of AI trading.
            </p>
          </div>

          {/* Checkpoint 2: Feature */}
          <div
            ref={text2Ref}
            className="absolute max-w-2xl text-center will-change-transform will-change-opacity px-6"
            style={{ opacity: 0, transform: 'translateY(50px)' }}
          >
            <h2 className="font-['Hanken_Grotesk'] text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Precision Meets Clarity
            </h2>
            <p className="font-['Hanken_Grotesk'] text-xl text-gray-300 leading-relaxed">
              Analyze markets with surgical accuracy using our proprietary AI models. Every decision, illuminated.
            </p>
          </div>

          {/* Checkpoint 3: CTA */}
          <div
            ref={text3Ref}
            className="absolute text-center will-change-transform will-change-opacity px-6"
            style={{ opacity: 0, transform: 'scale(0.95)' }}
          >
            <h2 className="font-['Hanken_Grotesk'] text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight">
              Ready to begin?
            </h2>
            <button className="pointer-events-auto bg-[#F7F9FB] text-[#0F172A] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white font-['Hanken_Grotesk'] font-semibold py-4 px-10 transition-colors text-lg mx-auto flex items-center justify-center">
              Start Paper Trading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroScrollAnimation;