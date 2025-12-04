"use client";

import { useEffect, useRef } from "react";
import logger from "@/utlis/logger";

/**
 * Automatically logs the user out after a period of inactivity.
 * Uses localStorage to persist the last activity time across page refreshes.
 *
 * @param {Object} params
 * @param {boolean} params.isAuthenticated - Whether the user is currently authenticated.
 * @param {Function} params.onIdle - Callback executed when the user is idle past the timeout.
 * @param {number} [params.timeout=30 * 60 * 1000] - Idle timeout in milliseconds.
 */
export const useIdleLogout = ({
  isAuthenticated,
  onIdle,
  timeout = 30 * 60 * 1000,
}) => {
  const timerRef = useRef(null);
  const lastActivityRef = useRef(null);
  const STORAGE_KEY = 'lastActivityTime';

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const saveLastActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      try {
        localStorage.setItem(STORAGE_KEY, now.toString());
      } catch (error) {
        logger.warn('Failed to save last activity time:', error);
      }
    };

    const getLastActivity = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? parseInt(stored, 10) : Date.now();
      } catch (error) {
        logger.warn('Failed to get last activity time:', error);
        return Date.now();
      }
    };

    const checkIdleTime = () => {
      if (!isAuthenticated) {
        return;
      }

      const lastActivity = getLastActivity();
      const now = Date.now();
      const elapsed = now - lastActivity;

      // If user has been idle longer than timeout, logout immediately
      if (elapsed >= timeout) {
        logger.info(`User idle for ${Math.round(elapsed / 1000 / 60)} minutes, logging out...`);
        if (typeof onIdle === "function") {
          onIdle();
        }
        return;
      }

      // Calculate remaining time
      const remaining = timeout - elapsed;
      clearTimer();
      
      timerRef.current = setTimeout(() => {
        logger.info('Idle timeout reached, logging out...');
        if (typeof onIdle === "function") {
          onIdle();
        }
      }, remaining);
    };

    const startTimer = () => {
      clearTimer();
      saveLastActivity();
      timerRef.current = setTimeout(() => {
        logger.info('Idle timeout reached, logging out...');
        if (typeof onIdle === "function") {
          onIdle();
        }
      }, timeout);
    };

    const resetTimer = () => {
      if (!isAuthenticated) {
        clearTimer();
        return;
      }

      saveLastActivity();
      startTimer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if user has been idle too long while tab was hidden
        checkIdleTime();
      } else {
        // Save activity time when tab becomes hidden
        saveLastActivity();
      }
    };

    const handleFocus = () => {
      if (isAuthenticated) {
        // Check if user has been idle too long
        checkIdleTime();
      }
    };

    const handleBlur = () => {
      if (isAuthenticated) {
        // Save activity time when window loses focus
        saveLastActivity();
      }
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
      "click",
    ];

    if (isAuthenticated) {
      // Check idle time on mount
      checkIdleTime();
      
      // Set up event listeners
      events.forEach((event) => {
        window.addEventListener(event, resetTimer, { passive: true });
      });
      
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);
    } else {
      clearTimer();
      // Clear stored activity time on logout
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        logger.warn('Failed to clear last activity time:', error);
      }
    }

    return () => {
      clearTimer();
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isAuthenticated, onIdle, timeout]);
};


