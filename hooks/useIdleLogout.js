"use client";

import { useEffect, useRef } from "react";

/**
 * Automatically logs the user out after a period of inactivity.
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

    const startTimer = () => {
      clearTimer();
      timerRef.current = setTimeout(() => {
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

      startTimer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetTimer();
      }
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "touchmove",
    ];

    if (isAuthenticated) {
      resetTimer();
      events.forEach((event) => window.addEventListener(event, resetTimer));
      document.addEventListener("visibilitychange", handleVisibilityChange);
    } else {
      clearTimer();
    }

    return () => {
      clearTimer();
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated, onIdle, timeout]);
};


