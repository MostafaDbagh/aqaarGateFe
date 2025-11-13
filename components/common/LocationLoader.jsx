"use client";
import React from 'react';

export default function LocationLoader({ 
  size = 'medium', 
  message = 'Finding properties...',
  showMessage = true 
}) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: '40px',
          icon: '24px',
          text: '12px'
        };
      case 'large':
        return {
          container: '80px',
          icon: '48px',
          text: '16px'
        };
      case 'medium':
      default:
        return {
          container: '60px',
          icon: '36px',
          text: '14px'
        };
    }
  };

  const styles = getSizeStyles();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      gap: '16px'
    }}>
      {/* Animated Location Pin Icon */}
      <div style={{
        width: styles.container,
        height: styles.container,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Pulsing background circle */}
        <div style={{
          position: 'absolute',
          width: styles.container,
          height: styles.container,
          backgroundColor: '#FF6B6B',
          borderRadius: '50%',
          animation: 'locationPulse 2s ease-in-out infinite'
        }} />
        
        {/* Location pin icon */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          width: styles.icon,
          height: styles.icon,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'locationBounce 1.5s ease-in-out infinite'
        }}>
          {/* SVG Location Pin */}
          <svg width={styles.icon} 
            height={styles.icon} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
           aria-hidden="true">
            <path 
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
              fill="white" 
              stroke="white" 
              strokeWidth="1"
            />
          </svg>
        </div>
        
        {/* Floating dots around the icon */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          animation: 'locationRotate 3s linear infinite'
        }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 60}deg) translateX(30px) translateY(-50%)`,
                animation: `locationDot ${1 + i * 0.1}s ease-in-out infinite alternate`
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading message */}
      {showMessage && (
        <div style={{
          color: '#666',
          fontSize: styles.text,
          fontWeight: '500',
          textAlign: 'center',
          animation: 'locationFade 2s ease-in-out infinite alternate'
        }}>
          {message}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes locationPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes locationBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes locationRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes locationDot {
          0% {
            opacity: 0.3;
            transform: rotate(var(--rotation, 0deg)) translateX(25px) translateY(-50%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: rotate(var(--rotation, 0deg)) translateX(35px) translateY(-50%) scale(1.2);
          }
        }

        @keyframes locationFade {
          0% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
