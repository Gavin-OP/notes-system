/**
 * Check if the application is running on localhost
 * @returns {boolean} true if running on localhost, false otherwise
 */
export const isLocalhost = () => {
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.startsWith("10.") ||
    window.location.hostname.endsWith(".local")
  );
};
