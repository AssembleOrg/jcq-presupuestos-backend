import { Request } from 'express';

export function getRealIp(request: Request): string {
  // Try to get the real IP from various headers
  const xForwardedFor = request.headers['x-forwarded-for'];
  const xRealIp = request.headers['x-real-ip'];
  const cfConnectingIp = request.headers['cf-connecting-ip'];
  
  if (xForwardedFor) {
    const ips = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
    return ips.split(',')[0].trim();
  }
  
  if (xRealIp) {
    return Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
  }
  
  if (cfConnectingIp) {
    return Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;
  }
  
  return request.ip || request.socket.remoteAddress || 'unknown';
}

export function getUserAgent(request: Request): string {
  return request.headers['user-agent'] || 'unknown';
}

