/**
 * Check if the application is running on localhost
 * Used to disable Google Analytics tracking during development
 * @returns {boolean} true if running on localhost, false otherwise
 */
export const isLocalhost = () => {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]"
  );
};
