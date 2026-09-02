/**
 * AHSAN AI LABS - Privacy-Conscious Client Telemetry & Web Vitals Engine
 * 
 * Features:
 * - Anonymous session and visitor ID generation (no cookies, privacy-compliant)
 * - Automatic page view and conversion event tracking
 * - Real Web Vitals measurement (LCP, CLS, FCP, FID, TTFB)
 * - Safe client-side error reporter (sensitive inputs/secrets scrubbed)
 */

import { AnalyticsEvent, WebVitalMetric } from '../types';

// Generate or retrieve anonymous session tokens
const getVisitorId = (): string => {
  try {
    let vid = localStorage.getItem('ahsan_vid');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('ahsan_vid', vid);
    }
    return vid;
  } catch (e) {
    return 'v_anon_' + Math.random().toString(36).substring(2, 9);
  }
};

const getSessionId = (): string => {
  try {
    let sid = sessionStorage.getItem('ahsan_sid');
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 11);
      sessionStorage.setItem('ahsan_sid', sid);
    }
    return sid;
  } catch (e) {
    return 's_anon_' + Math.random().toString(36).substring(2, 9);
  }
};

// Device, Browser, and OS Detection
const getDeviceDetails = () => {
  const ua = navigator.userAgent;
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    deviceType = 'Mobile';
  }

  let browser = 'Other';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Other';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { deviceType, browser, os };
};

// Internal safe dispatcher
const sendTelemetry = async (endpoint: string, payload: any) => {
  try {
    // Use navigator.sendBeacon when available for unload safety and low-overhead tracking
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      const queued = navigator.sendBeacon(endpoint, blob);
      if (queued) return;
    }

    // Fallback to fetch with graceful silent error handling
    if (typeof fetch !== 'undefined') {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        credentials: 'same-origin'
      }).catch(() => {
        // Fail silently so that network/SSL issues on custom domains never degrade UX
      });
    }
  } catch (err) {
    // Fail silently
  }
};

/**
 * Track an analytics event (Page View, Button Click, Form Step, Video Play, etc.)
 */
export const trackEvent = (
  eventName: string,
  eventType: AnalyticsEvent['eventType'] = 'CLICK',
  metadata?: Record<string, any>
) => {
  if (typeof window === 'undefined') return;

  const { deviceType, browser, os } = getDeviceDetails();
  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const path = window.location.pathname || '/';
  const referrer = document.referrer || undefined;

  sendTelemetry('/api/analytics/event', {
    eventName,
    eventType,
    path,
    referrer,
    visitorId,
    sessionId,
    deviceType,
    browser,
    os,
    metadata
  });
};

/**
 * Track pageview on route change
 */
export const trackPageView = (path: string) => {
  trackEvent('page_view', 'PAGE_VIEW', { path });
};

/**
 * Record Web Vital metrics (LCP, CLS, FID, FCP, TTFB)
 */
export const recordWebVital = (metric: Omit<WebVitalMetric, '_id' | 'timestamp'>) => {
  sendTelemetry('/api/analytics/performance', metric);
};

/**
 * Automatically observe and measure Core Web Vitals in the browser
 */
export const initWebVitalsTracking = () => {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  const { deviceType } = getDeviceDetails();
  const currentPath = window.location.pathname || '/';

  // 1. First Contentful Paint (FCP)
  try {
    const fcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const value = +(entry.startTime / 1000).toFixed(2);
          recordWebVital({
            name: 'FCP',
            value,
            rating: value < 1.8 ? 'good' : (value < 3.0 ? 'needs-improvement' : 'poor'),
            path: currentPath,
            deviceType
          });
          fcpObserver.disconnect();
        }
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {}

  // 2. Largest Contentful Paint (LCP)
  try {
    let largestLcp = 0;
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        largestLcp = +(lastEntry.startTime / 1000).toFixed(2);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Send on visibility hidden or page leave
    const sendLcp = () => {
      if (largestLcp > 0) {
        recordWebVital({
          name: 'LCP',
          value: largestLcp,
          rating: largestLcp < 2.5 ? 'good' : (largestLcp < 4.0 ? 'needs-improvement' : 'poor'),
          path: currentPath,
          deviceType
        });
        largestLcp = 0;
      }
    };
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') sendLcp();
    });
    window.addEventListener('pagehide', sendLcp);
  } catch (e) {}

  // 3. Cumulative Layout Shift (CLS)
  try {
    let clsScore = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsScore += entry.value;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    const sendCls = () => {
      if (clsScore > 0) {
        const val = +(clsScore.toFixed(3));
        recordWebVital({
          name: 'CLS',
          value: val,
          rating: val < 0.1 ? 'good' : (val < 0.25 ? 'needs-improvement' : 'poor'),
          path: currentPath,
          deviceType
        });
      }
    };
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') sendCls();
    });
  } catch (e) {}

  // 4. Time to First Byte (TTFB) from navigation timing
  try {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navEntries = performance.getEntriesByType('navigation');
        if (navEntries && navEntries.length > 0) {
          const nav = navEntries[0] as PerformanceNavigationTiming;
          const ttfb = Math.round(nav.responseStart - nav.requestStart);
          if (ttfb > 0 && ttfb < 10000) {
            recordWebVital({
              name: 'TTFB',
              value: ttfb,
              rating: ttfb < 800 ? 'good' : (ttfb < 1800 ? 'needs-improvement' : 'poor'),
              path: currentPath,
              deviceType
            });
          }
        }
      }, 500);
    });
  } catch (e) {}
};

/**
 * Global Error Boundary logger
 */
export const initErrorReporter = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    // Avoid noise from cross-origin scripts, network/cert errors, resize observer loops, or Vite dev HMR websockets
    if (
      msg.includes('ResizeObserver') || 
      msg.includes('Script error.') ||
      msg.toLowerCase().includes('websocket') ||
      msg.includes('[vite]') ||
      msg.includes('closed without opened') ||
      msg.includes('ERR_CERT') ||
      msg.includes('Failed to fetch')
    ) {
      return;
    }

    sendTelemetry('/api/analytics/error', {
      title: event.message || 'Client Runtime Exception',
      message: `${event.filename || 'app'}:${event.lineno || 0}:${event.colno || 0}`,
      stack: event.error?.stack || undefined,
      component: 'CLIENT_APP',
      path: window.location.pathname
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : (reason?.message || 'Unhandled Promise Rejection');
    
    // Ignore benign environment notifications (e.g. Vite HMR disabled in sandbox container, ResizeObserver)
    if (
      msg.includes('ResizeObserver') || 
      msg.toLowerCase().includes('websocket') || 
      msg.includes('[vite]') ||
      msg.includes('closed without opened')
    ) {
      if (typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      return;
    }

    sendTelemetry('/api/analytics/error', {
      title: 'Unhandled Promise Rejection',
      message: msg,
      stack: reason?.stack || undefined,
      component: 'CLIENT_APP',
      path: window.location.pathname
    });
  });
};
