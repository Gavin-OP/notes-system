/**
 * Shared breakpoint constants for responsive design
 * Centralized to ensure consistency across initial state and runtime detection
 */

/**
 * Mobile breakpoint threshold in pixels
 * Screens narrower than this width are considered mobile devices
 */
export const MOBILE_BREAKPOINT = 1024;

/**
 * Check if the current viewport width indicates a mobile device
 * @returns {boolean} true if viewport width is below the mobile breakpoint
 */
export const isMobileViewport = () => {
  return typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;
};

