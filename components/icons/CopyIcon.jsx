export default function CopyIcon({ width = 16, height = 16, stroke = "#6c757d", ...props }) {
  return (
    <svg 
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      aria-hidden="true"
    >
      <path
        d="M5.5 4.5C5.5 3.94772 5.94772 3.5 6.5 3.5H11.5C12.0523 3.5 12.5 3.94772 12.5 4.5V9.5C12.5 10.0523 12.0523 10.5 11.5 10.5H10.5V11.5C10.5 12.0523 10.0523 12.5 9.5 12.5H4.5C3.94772 12.5 3.5 12.0523 3.5 11.5V6.5C3.5 5.94772 3.94772 5.5 4.5 5.5H5.5V4.5Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 5.5H6.5C5.94772 5.5 5.5 5.94772 5.5 6.5V10.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

