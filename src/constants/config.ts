// API Configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  API_FETCH_LIMIT: 50,
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  TREND_DATA_POINTS: 10,
  CHART_HEIGHT: 200,
  RANDOM_VARIANCE: 5,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// JWT Configuration
export const JWT_CONFIG = {
  MILLISECONDS_MULTIPLIER: 1000,
} as const; 