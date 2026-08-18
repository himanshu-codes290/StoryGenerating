// Central API base URL — resolves from VITE_API_URL env var.
// Dev:  set VITE_API_URL=http://localhost:3000 (or leave empty to use Vite proxy)
// Prod: set VITE_API_URL=https://storygenerating.onrender.com
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
