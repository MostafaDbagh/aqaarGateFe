"use client";
import React, { useEffect, useState } from "react";

export default function SplitTextAnimation({
  text = "Grow your business with a new website.",
}) {
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Small delay to ensure hydration is complete
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const wordCount = text.split(" ").length;
  const charCount = text.length;

  // During SSR and initial render, use consistent styles to avoid hydration mismatch
  // Always use numbers for CSS variables to avoid string/number mismatch
  const baseStyle = {
    "--word-total": wordCount,
    "--char-total": charCount,
    visibility: "hidden", // Start hidden on both server and client to avoid hydration mismatch
  };

  // Only show after hydration completes
  const finalStyle = mounted
    ? { ...baseStyle, visibility: "visible" }
    : baseStyle;

  return (
    <>
      <span
        className="wow charsAnimIn words chars splitting"
        aria-hidden="true"
        style={finalStyle}
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
                      style={{ "--char-index": charIndex }}
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
