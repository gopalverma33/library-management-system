const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Keep a consistent base URL with trailing slash for legacy string concatenations.
export const Server_URL = backendUrl.endsWith("/")
  ? backendUrl
  : `${backendUrl}/`;
