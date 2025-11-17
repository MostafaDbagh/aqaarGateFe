"use client";
import React, { useEffect, useState } from "react";

export default function SplitTextAnimation({
  text = "Grow your business with a new website.",
}) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Delay to ensure hydration is complete and DOM is ready
    // Also ensures WOW.js has initialized
    const timer = setTimeout(() => {
      setMounted(true);
      // Force re-render to apply animated class
      // Also trigger animation by adding class to DOM element
      const elements = document.querySelectorAll('.splitting');
      elements.forEach(el => {
        if (!el.classList.contains('animated')) {
          el.classList.add('animated');
        }
      });
    }, 150); // Delay to ensure WOW.js and DOM are ready
    return () => clearTimeout(timer);
  }, []);

  const wordCount = text.split(" ").length;
  const charCount = text.length;

  // During SSR and initial render, use consistent styles to avoid hydration mismatch
  // Always use numbers for CSS variables to avoid string/number mismatch
  const baseStyle = {
    "--word-total": wordCount,
    "--char-total": charCount,
  };

  // Build className with 'animated' class when mounted
  // Add 'animated' class immediately on client side to trigger animation
  const className = `wow charsAnimIn words chars splitting${mounted && isClient ? ' animated' : ''}`;
  
  // Style to ensure visibility
  const style = {
    ...baseStyle,
  };

  return (
    <>
      <span
        className={className}
        aria-hidden="true"
        style={style}
        suppressHydrationWarning
      >
        {text
          .trim()
          .split(" ")
          .map((elm, i) => (
            <React.Fragment key={i}>
              <span
                className="word"
                data-word={elm}
                style={{ "--word-index": i }}
              >
                {elm.split("").map((elm2, i2) => {
                  // Calculate character index correctly
                  const charIndex = text
                    .trim()
                    .split(" ")
                    .slice(0, i)
                    .join(" ").length + i2 + (i > 0 ? 1 : 0);
                  
                  return (
                    <span
                      key={i2}
                      className="char"
                      data-char={elm2}
                      style={{ 
                        "--char-index": charIndex,
                        // Fallback: show text even if animation hasn't started
                        opacity: mounted ? undefined : 1
                      }}
                    >
                      {elm2}
                    </span>
                  );
                })}
              </span>
              <span className="whitespace"> </span>
            </React.Fragment>
          ))}
      </span>
    </>
  );
}
