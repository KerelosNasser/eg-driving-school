import React from "react";

interface LoadingIndicatorProps {
  /**
   * Background color for the loading overlay
   * @default 'rgba(255, 255, 255, 0.98)'
   */
  background?: string;
  /**
   * Animation duration in seconds
   * @default 2
   */
  duration?: number;
  /**
   * Size of the loading indicator
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
  /**
   * Custom message to display below the indicator
   */
  message?: string;
  /**
   * Whether to show as fullscreen overlay
   * @default true
   */
  fullscreen?: boolean;
}

const sizeMap = {
  sm: {
    container: 50,
    scale: 0.7,
    road: 120,
    roadHeight: 4,
    text: "text-sm",
    dotSize: 1.5,
  },
  md: {
    container: 70,
    scale: 1,
    road: 180,
    roadHeight: 6,
    text: "text-base",
    dotSize: 2,
  },
  lg: {
    container: 100,
    scale: 1.4,
    road: 240,
    roadHeight: 8,
    text: "text-lg",
    dotSize: 2.5,
  },
};

export function LoadingIndicator({
  background = "rgba(255, 255, 255, 0.98)",
  duration = 2,
  size = "md",
  message,
  fullscreen = true,
}: LoadingIndicatorProps) {
  const sizeConfig = sizeMap[size];

  return (
    <div
      className={`${
        fullscreen
          ? "fixed inset-0 z-50"
          : "relative w-full h-full min-h-[200px]"
      } flex items-center justify-center backdrop-blur-sm`}
      style={{ backgroundColor: background }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Car Animation Container */}
        <div
          className="relative flex flex-col items-center"
          style={{
            width: sizeConfig.road + 60,
            height: sizeConfig.container * 1.5,
          }}
        >
          {/* Animated Car with Shadow */}
          <div
            className="relative"
            style={{
              transform: `scale(${sizeConfig.scale})`,
              animation: `smoothDrive ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))",
            }}
          >
            <svg
              width={sizeConfig.container}
              height={sizeConfig.container}
              viewBox="0 0 120 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gradient for car body */}
                <linearGradient
                  id="carGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#FFD600" />
                  <stop offset="100%" stopColor="#FFC400" />
                </linearGradient>

                {/* Gradient for windows */}
                <linearGradient
                  id="windowGradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#B8E6F5" />
                  <stop offset="100%" stopColor="#7DCDEB" />
                </linearGradient>

                {/* Shadow filter */}
                <filter id="innerShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
                  <feOffset dx="0" dy="1" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Car Body Group */}
              <g>
                {/* Shadow under car */}
                <ellipse
                  cx="60"
                  cy="70"
                  rx="35"
                  ry="5"
                  fill="rgba(0, 0, 0, 0.15)"
                  style={{
                    animation: `shadowPulse ${duration}s ease-in-out infinite`,
                  }}
                />

                {/* Main car body - sleeker design */}
                <path
                  d="M 20 45 L 20 50 Q 20 55 25 55 L 95 55 Q 100 55 100 50 L 100 45 Q 100 42 98 40 L 85 35 L 35 35 L 22 40 Q 20 42 20 45 Z"
                  fill="url(#carGradient)"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  filter="url(#innerShadow)"
                />

                {/* Car cabin/roof */}
                <path
                  d="M 35 35 L 42 22 Q 43 20 45 20 L 75 20 Q 77 20 78 22 L 85 35 Z"
                  fill="url(#carGradient)"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                {/* Front windshield */}
                <path
                  d="M 78 34 L 75 24 Q 74.5 22 73 22 L 62 22 L 62 34 Z"
                  fill="url(#windowGradient)"
                  stroke="#1a1a1a"
                  strokeWidth="1"
                  opacity="0.95"
                />

                {/* Rear windshield */}
                <path
                  d="M 42 34 L 45 24 Q 45.5 22 47 22 L 58 22 L 58 34 Z"
                  fill="url(#windowGradient)"
                  stroke="#1a1a1a"
                  strokeWidth="1"
                  opacity="0.95"
                />

                {/* Car highlights */}
                <path
                  d="M 30 38 Q 35 37 40 38"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Wheels - with rotation */}
                <g>
                  {/* Front wheel */}
                  <circle
                    cx="75"
                    cy="58"
                    r="10"
                    fill="#1a1a1a"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <circle
                    cx="75"
                    cy="58"
                    r="7"
                    fill="#2a2a2a"
                    style={{
                      transformOrigin: "75px 58px",
                      animation: `wheelSpin ${
                        duration * 0.25
                      }s linear infinite`,
                    }}
                  />
                  <circle cx="75" cy="58" r="3" fill="#FFD600" />
                  {/* Wheel spokes */}
                  <g
                    style={{
                      transformOrigin: "75px 58px",
                      animation: `wheelSpin ${
                        duration * 0.25
                      }s linear infinite`,
                    }}
                  >
                    <line
                      x1="75"
                      y1="51"
                      x2="75"
                      y2="65"
                      stroke="#404040"
                      strokeWidth="1"
                    />
                    <line
                      x1="68"
                      y1="58"
                      x2="82"
                      y2="58"
                      stroke="#404040"
                      strokeWidth="1"
                    />
                  </g>

                  {/* Rear wheel */}
                  <circle
                    cx="45"
                    cy="58"
                    r="10"
                    fill="#1a1a1a"
                    stroke="#000"
                    strokeWidth="1"
                  />
                  <circle
                    cx="45"
                    cy="58"
                    r="7"
                    fill="#2a2a2a"
                    style={{
                      transformOrigin: "45px 58px",
                      animation: `wheelSpin ${
                        duration * 0.25
                      }s linear infinite`,
                    }}
                  />
                  <circle cx="45" cy="58" r="3" fill="#FFD600" />
                  {/* Wheel spokes */}
                  <g
                    style={{
                      transformOrigin: "45px 58px",
                      animation: `wheelSpin ${
                        duration * 0.25
                      }s linear infinite`,
                    }}
                  >
                    <line
                      x1="45"
                      y1="51"
                      x2="45"
                      y2="65"
                      stroke="#404040"
                      strokeWidth="1"
                    />
                    <line
                      x1="38"
                      y1="58"
                      x2="52"
                      y2="58"
                      stroke="#404040"
                      strokeWidth="1"
                    />
                  </g>
                </g>

                {/* Headlights with glow */}
                <circle
                  cx="98"
                  cy="47"
                  r="2.5"
                  fill="#FFF8DC"
                  stroke="#F4D03F"
                  strokeWidth="0.5"
                >
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur={`${duration}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Taillights */}
                <rect
                  x="22"
                  y="45"
                  width="3"
                  height="6"
                  rx="1"
                  fill="#DC143C"
                  opacity="0.9"
                />

                {/* Side mirror */}
                <ellipse cx="85" cy="38" rx="2" ry="3" fill="#1a1a1a" />

                {/* Door line detail */}
                <line
                  x1="60"
                  y1="35"
                  x2="60"
                  y2="52"
                  stroke="#1a1a1a"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </g>
            </svg>
          </div>

          {/* Professional Road */}
          <div
            className="relative mt-6 overflow-hidden rounded-full"
            style={{
              width: sizeConfig.road,
              height: sizeConfig.roadHeight,
              background: "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Animated road lane markers */}
            <div
              className="absolute top-1/2 left-0 flex -translate-y-1/2"
              style={{
                animation: `roadSlide ${duration * 0.7}s linear infinite`,
                gap: `${sizeConfig.road / 6}px`,
              }}
            >
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: sizeConfig.road / 8,
                    height: sizeConfig.roadHeight / 3,
                    backgroundColor: "#FFD600",
                    minWidth: 8,
                    opacity: 0.9,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Professional Loading Text */}
        {message && (
          <div className="text-center px-4">
            <p
              className={`${sizeConfig.text} font-semibold tracking-wide`}
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                color: "#1a1a1a",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
            >
              {message}
            </p>
          </div>
        )}

        {/* Default elegant loading animation */}
        {!message && (
          <div className="flex items-center gap-3">
            <span
              className={`${sizeConfig.text} font-semibold tracking-wide`}
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                color: "#1a1a1a",
              }}
            >
              Loading
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: sizeConfig.dotSize * 4,
                    height: sizeConfig.dotSize * 4,
                    backgroundColor: "#FFD600",
                    animation: `dotBounce ${
                      duration * 0.6
                    }s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Professional Animation Keyframes */}
      <style jsx>{`
        @keyframes smoothDrive {
          0% {
            transform: translateX(-${sizeConfig.road / 2.5}px)
              scale(${sizeConfig.scale});
          }
          50% {
            transform: translateX(${sizeConfig.road / 2.5}px)
              scale(${sizeConfig.scale});
          }
          100% {
            transform: translateX(-${sizeConfig.road / 2.5}px)
              scale(${sizeConfig.scale});
          }
        }

        @keyframes roadSlide {
          0% {
            transform: translateX(0) translateY(-50%);
          }
          100% {
            transform: translateX(-${sizeConfig.road / 3}px) translateY(-50%);
          }
        }

        @keyframes wheelSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes dotBounce {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-8px) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes shadowPulse {
          0%,
          100% {
            opacity: 0.15;
            transform: scaleX(1);
          }
          50% {
            opacity: 0.25;
            transform: scaleX(1.1);
          }
        }
      `}</style>
    </div>
  );
}

export default LoadingIndicator;
