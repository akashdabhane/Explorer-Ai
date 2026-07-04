// Rate limiting utilities for API routes
const rateLimitMap = new Map();

export function rateLimit(identifier, limit = 100, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get or create rate limit entry
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }

  const requests = rateLimitMap.get(identifier);
  
  // Remove old requests outside the window
  const validRequests = requests.filter((time) => time > windowStart);
  rateLimitMap.set(identifier, validRequests);

  // Check if limit exceeded
  if (validRequests.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: validRequests[0] + windowMs,
    };
  }

  // Add current request
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);

  return {
    allowed: true,
    remaining: limit - validRequests.length,
    resetTime: now + windowMs,
  };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of rateLimitMap.entries()) {
    const validRequests = requests.filter((time) => time > now - 15 * 60 * 1000);
    if (validRequests.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, validRequests);
    }
  }
}, 60 * 1000); // Clean every minute
