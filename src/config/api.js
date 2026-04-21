// API Configuration
const API_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? '' // Use same domain in production (Vercel)
    : 'http://localhost:5000' // Use localhost in development
);

export default API_URL;
