export default function BellIcon({ className = "", stroke = "#757575", width = 24, height = 24 }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <g clipPath="url(#clip0_429_11023)">
          <path 
            d="M6 19V10C6 6.68629 8.68629 4 12 4V4C15.3137 4 18 6.68629 18 10V19M6 19H18M6 19H4M18 19H20" 
            stroke={stroke} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          ></path>
          <path 
            d="M11 22L13 22" 
            stroke={stroke} 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          ></path>
          <circle 
            cx="12" 
            cy="3" 
            r="1" 
            stroke={stroke} 
            strokeWidth="2.5"
          ></circle>
        </g>
        <defs>
          <clipPath id="clip0_429_11023">
            <rect width="24" height="24" fill="white"></rect>
          </clipPath>
        </defs>
      </g>
    </svg>
  );
}



