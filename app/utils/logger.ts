// Production-ready logging utility
export const logger = {
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ℹ️ ${message}`, data);
    }
    // In production, send to monitoring service
  },
  
  error: (message: string, error?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${message}`, error);
    }
    // In production, send to error tracking service
  },
  
  warn: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ ${message}`, data);
    }
  },
  
  success: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${message}`, data);
    }
  }
};
