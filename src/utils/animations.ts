/**
 * Utility functions for animations
 */

// Safe browser environment check
const isBrowser = typeof window !== 'undefined';

// Safely access performance API
const getPerformanceNow = () => {
  if (isBrowser && window.performance) {
    return performance.now();
  }
  return Date.now();
};

// Safe wrapper for requestAnimationFrame
export const safeRequestAnimationFrame = (callback: FrameRequestCallback): number => {
  if (isBrowser && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  // Fallback to setTimeout with 16ms (approximately 60fps)
  return setTimeout(callback, 16) as unknown as number;
};

// Safe wrapper for cancelAnimationFrame
export const safeCancelAnimationFrame = (id: number): void => {
  if (isBrowser && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
};

// Scroll to a specific element with animation
export const animateScroll = (
  element: HTMLElement,
  to: number,
  duration: number = 300
) => {
  if (!element) return;
  
  const start = element.scrollTop;
  const change = to - start;
  const startTime = getPerformanceNow();

  const animateScroll = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    
    if (elapsedTime > duration) {
      element.scrollTop = to;
      return;
    }
    
    // Easing function: easeInOutQuad
    const progress = elapsedTime / duration;
    const easedProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    element.scrollTop = start + change * easedProgress;
    safeRequestAnimationFrame(animateScroll);
  };

  safeRequestAnimationFrame(animateScroll);
};

// Scroll to bottom of an element with animation
export const scrollToBottom = (
  element: HTMLElement,
  duration: number = 300
) => {
  if (!element) return;
  
  const to = element.scrollHeight - element.clientHeight;
  animateScroll(element, to, duration);
};

// Smoothly scroll to element
export const smoothScrollToElement = (element: HTMLElement | null, options: {
  duration?: number,
  offset?: number,
  onComplete?: () => void
} = {}): void => {
  if (!element || !isBrowser) return;
  
  const { 
    duration = 300, 
    offset = 0,
    onComplete 
  } = options;
  
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;
  
  const animation = (currentTime: number) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeInOutCubic = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition + distance * easeInOutCubic);
    
    if (timeElapsed < duration) {
      safeRequestAnimationFrame(animation);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  safeRequestAnimationFrame(animation);
};

// Animation utility for custom animations
export const animate = (options: {
  from: number,
  to: number,
  duration?: number,
  easing?: (t: number) => number,
  onUpdate: (value: number) => void,
  onComplete?: () => void
}): { cancel: () => void } => {
  const { 
    from, 
    to, 
    duration = 300, 
    easing = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    onUpdate,
    onComplete
  } = options;
  
  let startTime: number | null = null;
  let animationId: number | null = null;
  let isCancelled = false;
  
  const step = (currentTime: number) => {
    if (isCancelled) return;
    
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = from + (to - from) * easedProgress;
    
    onUpdate(currentValue);
    
    if (timeElapsed < duration) {
      animationId = safeRequestAnimationFrame(step);
    } else {
      // Ensure the final value is exactly the target
      onUpdate(to);
      if (onComplete) onComplete();
    }
  };
  
  if (isBrowser) {
    animationId = safeRequestAnimationFrame(step);
  } else {
    // If not in browser, just call with the final value
    onUpdate(to);
    if (onComplete) onComplete();
  }
  
  return {
    cancel: () => {
      if (animationId !== null) {
        isCancelled = true;
        safeCancelAnimationFrame(animationId);
      }
    }
  };
}; 